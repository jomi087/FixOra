import { PipelineStage } from "mongoose";
import { Category } from "../../../domain/entities/CategoryEntity";
import { KYCRequest } from "../../../domain/entities/KYCRequestEntity";
import { User } from "../../../domain/entities/UserEntity";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import KYCRequestModel from "../models/KYCRequestModel";

export class KYCRequestRepository implements IKYCRequestRepository {
    async findByUserId(userId: string): Promise<KYCRequest | null> {
        return await KYCRequestModel.findOne({ userId }).lean<KYCRequest>();
    }

    async findById(id: string): Promise<KYCRequest | null> {
        return await KYCRequestModel.findOne({ _id: id }).lean<KYCRequest>();

    }

    async create(data: KYCRequest): Promise<void> {
        await new KYCRequestModel(data).save();
    }

    async updateById(id: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null> {
        return await KYCRequestModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean<KYCRequest>();
    }

    async updateByUserId(userId: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null> {
        const updated = await KYCRequestModel.findOneAndUpdate(
            { userId },
            { $set: updateData, reviewedAt: undefined, reviewedBy: undefined, reason: undefined },
            { new: true }
        ).lean<KYCRequest>();
        return updated;
    }

    async findWithFilters(option: { searchQuery: string; filter: string },
        currentPage: number, limit: number
    ): Promise<{
        data: {
            id: string;
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location">
            kycInfo: Omit<KYCRequest, "userId" | "serviceId" | "specialixationIds">
            category: Partial<Category>
        }[];
        total: number
    }> {

        const { searchQuery, filter } = option;
        const skip = (currentPage - 1) * limit;

        const matchConditions:  Record<string, unknown>  = {};

        // Filter by status
        if (filter) {
            matchConditions.status = filter;
        }

        // Search by name or service
        if (searchQuery.trim()) {
            matchConditions.$or = [
                { "userDetails.fname": { $regex: searchQuery, $options: "i" } },
                { "userDetails.lname": { $regex: searchQuery, $options: "i" } },
                { "serviceDetails.name": { $regex: searchQuery, $options: "i" } }
            ];
        }

        const pipeline: PipelineStage[] = [
            //join User Colletion
            {
                $lookup: {
                    from: "users", //collection name  -> in db all colletion name will stored as plural and in lowerCase
                    localField: "userId",  //field in kycRequest
                    foreignField: "userId",  // field in User
                    pipeline: [
                        {
                            $project: {
                                userId: 1, fname: 1, lname: 1, email: 1, mobileNo: 1, location: 1
                            }
                        }
                    ],
                    as: "userDetails",
                }, //so  lookup  will return the data in a array
            }, { $unwind: "$userDetails" },
            //join Service  Colletion
            {
                $lookup: {
                    from: "categories",
                    localField: "serviceId",
                    foreignField: "categoryId",
                    pipeline: [
                        { $project: {  categoryId: 1, name: 1, subcategories: 1 } }
                    ],
                    as: "serviceDetails"
                }
            }, { $unwind: "$serviceDetails" },
            // Admin User (Optional)
            {
                $lookup: {
                    from: "users",
                    localField: "reviewedBy",
                    foreignField: "userId",
                    pipeline: [{
                        $project: {
                            fname: 1, lname: 1
                        }
                    }
                    ],
                    as: "adminDetails",
                }
            }, {
                $unwind: {
                    path: "$adminDetails",
                    preserveNullAndEmptyArrays: true  // keep null if pending
                }
            },
            // Match after lookup (status + search)
            { $match: matchConditions },
            {
                $project: {
                    id: "$_id",
                    user: {
                        userId: "$userDetails.userId",
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                        email: "$userDetails.email",
                        mobileNo: "$userDetails.mobileNo",
                        location: {
                            houseinfo: "$userDetails.location.houseinfo",
                            street: "$userDetails.location.street",
                            district: "$userDetails.location.district",
                            city: "$userDetails.location.city",
                            locality: "$userDetails.location.locality",
                            state: "$userDetails.location.state",
                            postalCode: "$userDetails.location.postalCode",
                            coordinates: "$userDetails.location.coordinates"
                        },
                    },
                    kycInfo: {
                        dob: "$dob",
                        gender: "$gender",
                        profileImage: "$profileImage",
                        serviceCharge: "$serviceCharge",
                        kyc: "$kyc",
                        status: "$status",
                        reason: "$reason",
                        submittedAt: "$submittedAt",
                        reviewedAt: "$reviewedAt",
                        reviewedBy: {
                            $cond: {
                                if: { $ifNull: ["$adminDetails", false] }, //$ifNull: [ <valueToCheck>, <returnValueforFalsy> ] -> if true then vlaueTOcheck will be return  else returnValueforFalsy will be returned
                                then: { $concat: ["$adminDetails.fname", " ", "$adminDetails.lname"] },
                                else: "$$REMOVE" //remove the field
                            }
                        }
                    },
                    category: {
                        categoryId: "$serviceDetails.categoryId",
                        name: "$serviceDetails.name",
                        subcategories: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$serviceDetails.subcategories",
                                        as: "sub",
                                        cond: { $in: ["$$sub.subCategoryId", "$specializationIds"] }
                                    }
                                },
                                as: "sub",
                                in: {
                                    subCategoryId: "$$sub.subCategoryId",
                                    name: "$$sub.name"
                                }
                            }
                        }

                    },


                }
            },
            {
                $facet: {
                    data: [
                        { $sort: { submittedAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }
        ];


        interface AggregatedFacetResult {
            data: {
                id: string;
                user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location">
                kycInfo: Omit<KYCRequest, "userId" | "serviceId" | "specialixationIds">
                category: Partial<Category>
            }[];
            totalCount: { total: number }[];
        }

        const result = await KYCRequestModel.aggregate<AggregatedFacetResult>(pipeline);
        // console.log(result[0].data); 
        const data = result[0].data ?? [];
        const total = result[0].totalCount[0]?.total ?? 0;

        return { data, total };
    }

}

