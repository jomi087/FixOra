import { Category } from "../../../domain/entities/CategoryEntity.js";
import { Provider, ProviderWithDetails } from "../../../domain/entities/ProviderEntity.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import { RoleEnum } from "../../../shared/constant/Roles.js";
import ProviderModel from "../models/ProviderModel.js";
import UserModel from "../models/UserModel.js";

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
                        location: "$userDetails.location",
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
        
    async findActiveProvidersWithFilters(
        option: {
            searchQuery: string;
            filter: string;
            extraFilter?: {
                selectedService?: string;
                nearByFilter?: string;
                ratingFilter?: number;
                availabilityFilter?: string;
            },
            coordinates : {
                latitude: number;
                longitude: number;
            }
        },
        currentPage: number, limit: number
    ): Promise<{ data: { user: Partial<User>, provider: Partial<Provider>, category: Partial<Category>, averageRating: number;  totalRatings: number; }[]; total: number }>{
        
        
        const { searchQuery, filter, extraFilter, coordinates } = option;
        const skip = (currentPage - 1) * limit;

        const pipeline: any[] = []
        const hasNearbyFilter = extraFilter?.nearByFilter && coordinates?.latitude && coordinates?.longitude;
        
        if ( hasNearbyFilter ) {
            let minDistance = 0
            let maxDistance = Infinity
        
            switch (extraFilter.nearByFilter) {
                case "0to5km":
                    maxDistance = 5000;
                    break;
                case "0to10km":
                    minDistance = 0;
                    maxDistance = 10000;
                    break;
                case "0to15km":
                    minDistance = 0;
                    maxDistance = 15000;
                    break;
                default :
                    break
            }
                    
            pipeline.push(
                {
                    $geoNear: {  //$geoNear is a stage like $match $group ....
                        near: {
                            type: "Point",
                                coordinates: [coordinates.longitude, coordinates.latitude]
                        },
                        distanceField: "distance",
                        maxDistance: maxDistance,
                        spherical: true,
                        key: "location.geo",
                        distanceMultiplier: 0.001,
                    },
                },
                {
                    $match: {
                        distance: { $gte: minDistance * 0.001, $lt: maxDistance * 0.001 }
                    }
                },
            )

        }

        const sortCondition: any = {}
        switch (filter) {
            case 'ascending':
                sortCondition["fname"] = 1;
                break;
            case 'descending':
                sortCondition["fname"] = -1;
                break;
            default:
                sortCondition["averageRating"] = -1;
                break;   
        }
    
        const matchUserConditions :any = {
            role: "provider",
            isBlocked: false,
        };

        if (searchQuery.trim()) {
            matchUserConditions.$or = [
                { "fname": { $regex: searchQuery, $options: "i" } },
                { "lname": { $regex: searchQuery, $options: "i" } },
            ]
        }

        const matchServiceCondition: any = {};
        if (extraFilter?.selectedService) {
            matchServiceCondition["serviceDetails.categoryId"] = extraFilter.selectedService
        }

        const matchRatingCondition:any = {}            
        if (extraFilter?.ratingFilter) {
            matchRatingCondition["averageRating"]  = { $gte: extraFilter.ratingFilter }
        }

        //logic for availabilty filter to be added (will add later on the basis of booking)
        

        pipeline.push(
            {
                $lookup: {  
                    from: "providers",
                    localField: "userId",  //field in user
                    foreignField: "userId", //field in provider
                    as : "providerDetails",
                },
            }, { $unwind: "$providerDetails" },
            { $match :  matchUserConditions  },
            {
                $lookup: {
                    from: "categories",
                    localField: "providerDetails.serviceId",
                    foreignField: "categoryId",
                    as: "serviceDetails"
                }
            }, { $unwind: "$serviceDetails" },
            { $match :  matchServiceCondition  },
            {
                $lookup: {
                    from: "ratings",              
                    localField: "providerDetails.providerId",      
                    foreignField: "providerId",    
                    as: "ratings"
                }
            },
            {
                $addFields: {
                    averageRating: { 
                        $cond: [
                            { $gt: [{ $size: "$ratings" }, 0] },
                            { $avg: "$ratings.rating" },  // avg rating if exists
                            0                             // else default 0
                        ]
                    },
                    totalRatings: { $size: "$ratings" } // how many ratings
                }
            },
            { $match: matchRatingCondition },
            { $sort: sortCondition },
            {
                $project: {
                    _id: 0,
                    user: {
                        userId: "$userId",
                        fname: "$fname",
                        lname: "$lname",
                        mobileNo: "$mobileNo",
                        location: "$location",
                    },
                    provider: {
                        providerId: "$providerDetails.providerId",
                        gender: "$providerDetails.gender",
                        profileImage: "$providerDetails.profileImage",
                        serviceCharge: "$providerDetails.serviceCharge",
                        isOnline: "$providerDetails.isOnline",
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
                                        cond: { $in: ["$$sub.subCategoryId",  "$providerDetails.specializationIds"] } 
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
                    averageRating: 1,
                    totalRatings: 1,
                    ...(hasNearbyFilter && {distance:1})
                }
            },
            {
                $facet: {
                    data: [
                       
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "total" }
                    ]
                }
            }
        )


        interface AggregatedFacetResult {
            data : { user: Partial<User>, provider: Partial<Provider>, category: Partial<Category>, averageRating: number, totalRatings: number; }[];
            totalCount: { total: number }[];
        }

        const result = await UserModel.aggregate<AggregatedFacetResult>(pipeline)
        console.log(result[0].data)


        return {
            data: result[0].data || [],
            total: result[0].totalCount[0]?.total || 0
        }
    }
    
}


    
