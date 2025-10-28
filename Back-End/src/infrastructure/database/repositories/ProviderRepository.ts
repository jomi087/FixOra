import { PipelineStage } from "mongoose";
import { Provider } from "../../../domain/entities/ProviderEntity";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository";
import { RoleEnum } from "../../../shared/enums/Roles";
import ProviderModel from "../models/ProviderModel";
import { User } from "../../../domain/entities/UserEntity";
import { Category } from "../../../domain/entities/CategoryEntity";


export class ProviderRepository implements IProviderRepository {
    async create(data: Provider): Promise<void> {
        await new ProviderModel(data).save();
    }

    async findByUserId(userId: string): Promise<Provider | null> {
        return await ProviderModel.findOne({ userId }).lean();
    }

    async findProvidersWithFilters(option: { searchQuery: string; filter: string }, currentPage: number, limit: number): Promise<{
        data: {
            user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location">
            provider: Pick<Provider, "providerId" | "dob" | "gender" | "profileImage" | "serviceCharge" | "kyc" | "isOnline">
            service: Pick<Category, "categoryId" | "name" | "subcategories">
        }[]
        total: number
    }> {
        const { searchQuery, filter } = option;
        const skip = (currentPage - 1) * limit;

        const matchConditions: Record<string, unknown> = { "userDetails.role": RoleEnum.Provider };

        // Filter by status
        if (filter === "blocked") matchConditions["userDetails.isBlocked"] = true;
        else if (filter === "unblocked") matchConditions["userDetails.isBlocked"] = false;
        else if (filter === "online") matchConditions.isOnline = true;
        else if (filter === "offline") matchConditions.isOnline = false;

        // Search by name or service
        if (searchQuery.trim()) {
            matchConditions.$or = [
                { "userDetails.fname": { $regex: searchQuery, $options: "i" } },
                { "userDetails.lname": { $regex: searchQuery, $options: "i" } },
                { "serviceDetails.name": { $regex: searchQuery, $options: "i" } }
            ];
        }

        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    pipeline: [
                        {
                            $project: {
                                userId: 1, fname: 1, lname: 1, email: 1, mobileNo: 1, location: 1, isBlocked: 1, role: 1
                            }
                        }
                    ],
                    as: "userDetails",
                },
            }, { $unwind: "$userDetails" },
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
            { $match: matchConditions },
            {
                $project: {
                    _id: 0,
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
                    provider: {
                        providerId: "$providerId",
                        dob: "$dob",
                        gender: "$gender",
                        profileImage: "$profileImage",
                        serviceCharge: "$serviceCharge",
                        kyc: "$kyc",
                        isOnline: "$isOnline"
                    },
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
                user: Pick<User, "userId" | "fname" | "lname" | "email" | "mobileNo" | "location">
                provider: Pick<Provider, "providerId" | "dob" | "gender" | "profileImage" | "serviceCharge" | "kyc" | "isOnline">
                service: Pick<Category, "categoryId" | "name" | "subcategories">
            }[]
            totalCount: { total: number }[];
        }

        const result = await ProviderModel.aggregate<AggregatedFacetResult>(pipeline);
        
        return {
            data: result[0].data || [],
            total: result[0].totalCount[0]?.total || 0
        };
    }

    async findProviderServiceInfoById(userId: string): Promise<{
        provider: Pick<Provider, "providerId" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
    }> {

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    userId: userId
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "serviceId",
                    foreignField: "categoryId",
                    as: "serviceDetails"
                },

            }, { $unwind: "$serviceDetails" },
            { $match: { "serviceDetails.isActive": true } },
            {
                $project: {

                    provider: {
                        providerId: "$providerId",
                        serviceCharge: "$serviceCharge",
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

        ];

        const result = await ProviderModel.aggregate(pipeline);
        console.log("result[0]", result[0]);
        return result[0];
    }

    async updateProviderService(userId: string, data: Partial<Provider>): Promise<Provider | null> {
        return await ProviderModel.findOneAndUpdate(
            { userId },
            {
                $set: {
                    ...(data.serviceCharge && { serviceCharge: data.serviceCharge }),
                    ...(data.specializationIds && { specializationIds: data.specializationIds }),
                },
            },
            { new: true }
        ).lean<Provider>();
    }


    async findServiceId(userId: string): Promise<string | null> {
        const provider = await ProviderModel.findOne(
            { userId },
            { serviceId: 1, _id: 0 }
        ).lean<{ serviceId?: string }>();

        return provider?.serviceId ?? null;
    }
}



