// Infrastructure talking to MongoDB using the IUserRepository interface.
// Parameters like email/userId come from the use case layer.
import { RoleEnum } from "../../../shared/Enums/Roles.js";
import { User } from "../../../domain/entities/UserEntity.js";
import { Provider } from "../../../domain/entities/ProviderEntity.js";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository.js";
import UserModel from "../models/UserModel.js";
import { UserDTO } from "../../../domain/outputDTO's/UserDTO.js";
import { Category } from "../../../domain/entities/CategoryEntity.js";
import { BookingStatus } from "../../../shared/Enums/BookingStatus.js";
import { Booking } from "../../../domain/entities/BookingEntity.js";

//!mistake in this repository (i have am violatin srp rule need to re-work) 
//split the logic into indivijual

export class UserRepository implements IUserRepository {
    async findByEmail(email: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ email }).select(omitSelect).lean<Partial<User>>()  //mongo db methods 
    }

    async create(user: UserDTO): Promise<User>{
        const newUser = new UserModel(user)
        await newUser.save();
        return newUser.toObject() as User;
    }

    async findByUserId(userId: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ userId }).select(omitSelect).lean<Partial<User>>()
    }

    async findByUserGoogleId(googleId: string, omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOne({ googleId }).select(omitSelect).lean<Partial<User>>()
    }

    async updateRole(userId : string, role : RoleEnum, omitFields : Array<keyof User>=[] ): Promise<Partial<User> | null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOneAndUpdate(
            { userId },
            { $set: { role } },
            { new : true }
        ).select(omitSelect).lean<Partial<User>>();
    }

    async updateProfie(userId: string,
        updateData: Pick<User, "fname" | "lname" | "mobileNo" | "location">
    ) : Promise<Pick<User, "fname" | "lname" | "mobileNo" | "location">> {
        const updatedUser = await UserModel.findOneAndUpdate({ userId }, 
        {
            $set: {
                fname: updateData.fname,
                lname: updateData.lname,
                mobileNo: updateData.mobileNo,
                location: updateData.location
            }
        },  
        {
            new: true,          
            projection: {    
            password: 0,
            refreshToken: 0
            }
        }
        ).lean(); 

        if (!updatedUser) throw new Error("User not found");

        return updatedUser;
    }

//spli this method
    async update( filter: Partial<Pick<User, "email" | "userId" | "googleId" >> , updates: Partial<User>,  omitFields:Array<keyof User>=[]): Promise<Partial<User>| null>{
        const omitSelect = omitFields.map(field => `-${field}`).join(' ')
        return await UserModel.findOneAndUpdate(
            filter,
            { $set: updates },
            { new: true }
        ).select(omitSelect).lean<Partial<User>>()
    }
//_____________

    async findUsersWithFilters(options: { searchQuery: string; filter: string },currentPage: number, limit: number, omitFields: Array<keyof User>=[]): Promise<{ data: Partial<User>[]; total: number }>{
        
        const { searchQuery, filter } = options
        const query: any = { role: RoleEnum.Customer };
        //if (searchQuery) { query.fname = { $regex: searchQuery, $options: "i" }; }

        if (searchQuery) {
            query.$or = [
                { fname: { $regex: searchQuery, $options: "i" } },
                { lname: { $regex: searchQuery, $options: "i" } },
            ];
        }

        if (filter === "blocked") {
            query.isBlocked = true
        } else if (filter === "unblocked") {
            query.isBlocked = false
        }
        
        const omitSelect = omitFields.map(field => `-${field}`).join(' ');

        const total = await UserModel.countDocuments(query);
        const users = await UserModel.find(query)
            .select(omitSelect)
            .skip((currentPage - 1) * limit)
            .limit(limit)
            .lean<Partial<User>[]>();

        return { data : users, total}
    };

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
            coordinates: {
                latitude: number;
                longitude: number;
            }
        },
        currentPage: number, limit: number
    ): Promise<{
        data: {
            user: Pick<User, "userId" | "fname" | "lname">,
            provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
            category: Pick<Category, "categoryId" | "name" | "subcategories">
            averageRating: number; totalRatings: number;
        }[]; total: number
    }> {
        
        
        const { searchQuery, filter, extraFilter, coordinates } = option;
        const skip = (currentPage - 1) * limit;

        const pipeline: any[] = []
        const hasNearbyFilter = extraFilter?.nearByFilter && coordinates?.latitude && coordinates?.longitude;
        
        if (hasNearbyFilter) {
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
                default:
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
    
        const matchUserConditions: any = {
            role: "provider",
            isBlocked: false,
        };

        if (searchQuery.trim()) {
            matchUserConditions.$or = [
                { "fname": { $regex: searchQuery, $options: "i" } },
                { "lname": { $regex: searchQuery, $options: "i" } },
            ]
        }

        //filter via service(category)
        const matchServiceCondition: any = {};
        matchServiceCondition["serviceDetails.isActive"] = true
        if (extraFilter?.selectedService) {
            matchServiceCondition["serviceDetails.categoryId"] = extraFilter.selectedService
        }

        // filter via rating
        const matchRatingCondition: any = {}
        if (extraFilter?.ratingFilter) {
            matchRatingCondition["averageRating"] = { $eq: extraFilter.ratingFilter }
        }

        //logic for availabilty filter to be added (will add later on the basis of booking)
        

        pipeline.push(
            {
                $lookup: {
                    from: "providers",
                    localField: "userId",  //field in user
                    foreignField: "userId", //field in provider
                    as: "providerDetails",
                },
            }, { $unwind: "$providerDetails" },
            { $match: matchUserConditions },
            {
                $lookup: {
                    from: "categories",
                    localField: "providerDetails.serviceId",
                    foreignField: "categoryId",
                    as: "serviceDetails"
                }
            }, { $unwind: "$serviceDetails" },
            { $match: matchServiceCondition },
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
                                        cond: { $in: ["$$sub.subCategoryId", "$providerDetails.specializationIds"] }
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
                    ...(hasNearbyFilter && { distance: 1 })
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
            data: {
                user: Pick<User, "userId" | "fname" | "lname">,
                provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
                category: Pick<Category, "categoryId" | "name" | "subcategories">
                averageRating: number, totalRatings: number;
            }[];
            totalCount: { total: number }[];
        }

        const result = await UserModel.aggregate<AggregatedFacetResult>(pipeline)
        // console.log(result[0].data)


        return {
            data: result[0].data || [],
            total: result[0].totalCount[0]?.total || 0
        }
    }

    async findProviderBookingsById(providerId: string, coordinates: { latitude: number; longitude: number }): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
        booking: Pick<Booking, "bookingId" | "scheduledAt"| "status">[]
        distanceFee: number
    }>{
        const matchConditions :any = {
            role : "provider",
            isBlocked: false,
            "providerDetails.providerId" : providerId
        };

        const pipeline: any[] = [
            {
                $geoNear: { 
                    near: {
                        type: "Point",
                        coordinates: [coordinates.longitude, coordinates.latitude] //user location (customer)
                    },
                    distanceField: "distance",
                    spherical: true,
                    key: "location.geo", //provider location
                    distanceMultiplier: 0.001,
                },
            },
            {
                $lookup: {
                    from: "providers",
                    localField: "userId",
                    foreignField: "userId",
                    as: 'providerDetails'
                },
            },
            { $unwind: "$providerDetails" },
            { $match :  matchConditions },
            {
                $lookup: {
                    from: "categories",
                    localField: "providerDetails.serviceId",
                    foreignField: "categoryId",
                    as: "serviceDetails"
                }
            }, { $unwind: "$serviceDetails" },
            { $match: { "serviceDetails.isActive": true } },
            {
                $lookup: {
                    from: "bookings",
                    localField: "providerDetails.providerId",
                    foreignField: "provider.id",
                    as : 'bookingDetails'
                }
            },
           // { $match: { "bookingDetails.scheduledAt": gtreaterthan ot equal to currentdate } },

            {
                $addFields: {
                    distanceFee: {
                        $switch: {
                            branches: [
                                {
                                    case: { $lte: ["$distance", 5] },
                                    then: 0,
                                },
                                {
                                    case: { $and: [{ $gt: ["$distance", 5] }, { $lte: ["$distance", 10] }] },
                                    then: 30,
                                },
                                {
                                    case: { $and: [{ $gt: ["$distance", 10] }, { $lte: ["$distance", 15] }] },
                                    then: 60,
                                },
                            ],
                            default: 90, // For >15 km
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    user: {
                        userId: "$userId",
                        fname: "$fname",
                        lname: "$lname",
                    },
                    provider: {
                        providerId: "$providerDetails.providerId",
                        gender: "$providerDetails.gender",
                        profileImage: "$providerDetails.profileImage",
                        serviceCharge: "$providerDetails.serviceCharge",
                        isOnline: "$providerDetails.isOnline"
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
                    booking : {
                        $map: {
                            input: {
                                $filter: {
                                    input: "$bookingDetails",
                                    as: "booking",
                                    cond: { $in: ["$$booking.status", ["Confirmed", "Pending"]] }
                                }
                            },
                            as: "booking",
                            in: {
                                bookingId: "$$booking.bookingId",
                                scheduledAt: "$$booking.scheduledAt",
                                status: "$$booking.status"
                            }
                        }
                    },
                    distanceFee:1,
                }
            }
        ]
        
        interface AggregatedResult {
            user: Pick<User, "userId" | "fname" | "lname">,
            provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
            category: Pick<Category, "categoryId" | "name" | "subcategories">
            booking: Pick<Booking, "bookingId" | "scheduledAt" | "status">[]
            distanceFee: number
        }

        const result = await UserModel.aggregate<AggregatedResult>(pipeline)
        //console.log("come on",result[0])

        return result[0]
    }

    async getServiceChargeWithDistanceFee(providerId: string, coordinates: { latitude: number; longitude: number; }): Promise<{ serviceCharge: number; distanceFee: number; }| null> {
        const matchConditions :any = {
            role : "provider",
            isBlocked: false,
            "providerDetails.providerId" : providerId
        };
        const pipeline: any[] = [
            {
                $geoNear: { 
                    near: {
                        type: "Point",
                        coordinates: [coordinates.longitude, coordinates.latitude] //user location (customer)
                    },
                    distanceField: "distance",
                    spherical: true,
                    key: "location.geo", //provider location
                    distanceMultiplier: 0.001,
                },
            },
            {
                $lookup: {
                    from: "providers",
                    localField: "userId",
                    foreignField: "userId",
                    as: 'providerDetails'
                },
            },
            { $unwind: "$providerDetails" },
            { $match: matchConditions },
            {
                $addFields: {
                    distanceFee: {
                        $switch: {
                            branches: [
                                {
                                    case: { $lte: ["$distance", 5] },
                                    then: 0,
                                },
                                {
                                    case: { $and: [{ $gt: ["$distance", 5] }, { $lte: ["$distance", 10] }] },
                                    then: 30,
                                },
                                {
                                    case: { $and: [{ $gt: ["$distance", 10] }, { $lte: ["$distance", 15] }] },
                                    then: 60,
                                },
                            ],
                            default: 90, // For >15 km
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    serviceCharge: "$providerDetails.serviceCharge",
                    distanceFee: 1
                }
            }

        ]
        interface AggregatedResult {  
            serviceCharge: number;
            distanceFee: number;
        }

        const result = await UserModel.aggregate<AggregatedResult>(pipeline)
        return result[0]
    }    
}



