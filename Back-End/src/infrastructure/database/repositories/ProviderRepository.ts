import { Category } from "../../../domain/entities/CategoryEntity.js";
import { Provider, ProviderWithDetails } from "../../../domain/entities/ProviderEntity.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { RoleEnum } from "../../../shared/Enums/Roles.js";
import ProviderModel from "../models/ProviderModel.js";


export class ProviderRepository implements IProviderRepository{
    async create(data: Provider): Promise<void> {
        await new ProviderModel(data).save()
    }

    async findByUserId(userId: string): Promise<Provider | null>{
        return await ProviderModel.findOne({userId}).lean()
    }
    

    async findProvidersWithFilters(option: { searchQuery: string; filter: string }, currentPage: number, limit: number): Promise<{ data: ProviderWithDetails[]; total: number }> {
        const { searchQuery, filter } = option;
        const skip = (currentPage - 1) * limit;

        const matchConditions: any = {"userDetails.role" : RoleEnum.Provider};

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

        const pipeline: any[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "userId",
                    pipeline: [
                        {
                            $project: {
                                userId: 1, fname: 1, lname: 1, email: 1, mobileNo: 1, location: 1 , isBlocked : 1 , role : 1
                            }
                        }
                    ],
                    as : "userDetails",
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
                    _id : 0,
                    providerId: 1,
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
                        isBlocked: "$userDetails.isBlocked"
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
                    isOnline : 1
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
        ]

        interface AggregatedFacetResult {
            data: ProviderWithDetails[];
            totalCount: { total: number }[];
        }

        const result = await ProviderModel.aggregate<AggregatedFacetResult>(pipeline)
        console.log("result look specializaton id",result[0].data)
        
        return {
            data: result[0].data || [],
            total: result[0].totalCount[0]?.total || 0
        }
    }
    
}


    
