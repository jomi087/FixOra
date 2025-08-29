import { KYCRequest, KYCRequestWithDetails } from "../../../domain/entities/KYCRequestEntity";
import { IKYCRequestRepository } from "../../../domain/interface/RepositoryInterface/IKYCRequestRepository";
import KYCRequestModel from "../models/KYCRequestModel";
import { ObjectId } from "mongodb";

export class KYCRequestRepository implements IKYCRequestRepository {
    async findByUserId(userId: string): Promise<KYCRequest | null> {
        return await KYCRequestModel.findOne({ userId }).lean<KYCRequest>();
    }

    async findById(id: string): Promise<KYCRequest | null>{
        return await KYCRequestModel.findOne({ _id: id }).lean<KYCRequest>();

    }
    
    async create(data: KYCRequest): Promise<void> {
        await new KYCRequestModel(data).save();
    }

    async updateById(id: string, updateData: Partial<KYCRequest>): Promise<KYCRequest | null>{
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

    async findWithFilters( option: { searchQuery: string; filter: string }, currentPage: number, limit: number ): Promise<{ data: KYCRequestWithDetails []; total: number }> {
        const { searchQuery, filter } = option;
        const skip = (currentPage - 1) * limit;

        const matchConditions: any = {};

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

        const pipeline: any[] = [
            //join User Colletion
            {
                $lookup: {
                    from: "users", //collection name  -> in db all colletion name will stored as plural and in lowerCase
                    localField: "userId",  //field in kycRequest
                    foreignField: "userId",  // field in User
                    pipeline: [
                        { $project: { 
                            userId: 1, fname: 1, lname: 1, email: 1, mobileNo: 1, location: 1 
                        } }
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
                        { $project: { name: 1, subcategories: 1 } }
                    ],
                    as: "serviceDetails"
                }
            }, { $unwind: "$serviceDetails" },
            // Admin User (Optional)
            {
                $lookup : {
                    from: "users",
                    localField: "reviewedBy",  
                    foreignField: "userId", 
                    pipeline: [{
                        $project: { 
                            fname: 1, lname: 1
                        } }
                    ],
                    as: "adminDetails",
                }
            },{
                $unwind: { 
                    path: "$adminDetails", 
                    preserveNullAndEmptyArrays: true  // keep null if pending
                }
            },
            // Match after lookup (status + search)
            { $match: matchConditions },

            // Project into the shape of KYCRequestWithDetails
            {
                $project: {
                    id: "$_id",
                    user: {
                        userId: "$userDetails.userId", 
                        fname: "$userDetails.fname",
                        lname: "$userDetails.lname",
                        email: "$userDetails.email",
                        mobileNo: "$userDetails.mobileNo",
                        location: "$userDetails.location"
                    },
                    dob: 1,
                    gender: 1,
                    service: {
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
                    profileImage: 1,
                    serviceCharge: 1,
                    kyc: 1,
                    status: 1,
                    reason: 1,
                    submittedAt: 1,
                    reviewedAt: 1,
                    reviewedBy: {
                        $cond: {
                            if: { $ifNull: ["$adminDetails", false] }, //$ifNull: [ <valueToCheck>, <returnValueforFalsy> ] -> if true then vlaueTOcheck will be return  else returnValueforFalsy will be returned
                            then: { $concat: ["$adminDetails.fname", " ", "$adminDetails.lname"] },
                            else: "$$REMOVE" //remove the field
                        }
                    }
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

        type AggregatedKYC = Omit<KYCRequestWithDetails, "id"> & { id: ObjectId };  //removing  id : string from type KYCRequestWithDetails and replacing it wiltl id: objectID cz aggration will return _id as an object id
 
        interface AggregatedFacetResult {
            data: AggregatedKYC[];
            totalCount: { total: number }[];
        }

        const result = await KYCRequestModel.aggregate<AggregatedFacetResult>(pipeline); 
        console.log("result without id ",result[0].data[2]);

        const rawData  = result[0].data || [];
        const total = result[0].totalCount[0]?.total || 0;
        
        const mappedData: KYCRequestWithDetails[] = rawData.map((doc) => ({
            ...doc,
            id: doc.id.toString(), // convert ObjectId → string
        })); 

        console.log("mappedData with id",mappedData[2]);
        return { data:mappedData, total };
    }

}

