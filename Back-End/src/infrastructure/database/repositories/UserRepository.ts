import { RoleEnum } from "../../../shared/enums/Roles";
import { User } from "../../../domain/entities/UserEntity";
import { IUserRepository } from "../../../domain/interface/RepositoryInterface/IUserRepository";
import UserModel from "../models/UserModel";
import { Category } from "../../../domain/entities/CategoryEntity";
import { Booking } from "../../../domain/entities/BookingEntity";
import { Provider } from "../../../domain/entities/ProviderEntity";
import { Availability } from "../../../domain/entities/AvailabilityEntity";
import { PipelineStage } from "mongoose";

export class UserRepository implements IUserRepository {


    async findByEmail(email: string, omitFields: Array<keyof User> = []): Promise<Partial<User> | null> {
        const omitSelect = omitFields.map(field => `-${field}`).join(" ");
        return await UserModel.findOne({ email }).select(omitSelect).lean<Partial<User>>();  //mongo db methods 
    }

    async create(user: User): Promise<User> {
        const newUser = new UserModel(user);
        await newUser.save();
        return newUser.toObject() as User;
    }

    async delete(userId: string): Promise<void> {
        await UserModel.findOneAndDelete({ userId });
    }

    async findByUserId(userId: string, omitFields: Array<keyof User> = []): Promise<Partial<User> | null> {
        const omitSelect = omitFields.map(field => `-${field}`).join(" ");
        return await UserModel.findOne({ userId }).select(omitSelect).lean<Partial<User>>();
    }

    async findUserEmail(userId: string): Promise<string | null> {
        const user = await UserModel.findOne({ userId }, { email: 1, _id: 0 }).lean();
        return user ? user.email : null;
    }

    async findByUserGoogleId(googleId: string): Promise<User | null> {
        return await UserModel.findOne({ googleId }).lean<User>();
    }

    async updateRole(userId: string, role: RoleEnum, omitFields: Array<keyof User> = []): Promise<Partial<User> | null> {
        const omitSelect = omitFields.map(field => `-${field}`).join(" ");
        return await UserModel.findOneAndUpdate(
            { userId },
            { $set: { role } },
            { new: true }
        ).select(omitSelect).lean<Partial<User>>();
    }

    async updateSelectedLocation(userId: string, location: { address: string; lat: number; lng: number }): Promise<void> {
        await UserModel.findOneAndUpdate(
            { userId },
            {
                selectedLocation: {
                    ...location,
                    updatedAt: new Date()
                }
            }
        );
    }

    async updateProfie(userId: string,
        updateData: Pick<User, "fname" | "lname" | "mobileNo" | "location">
    ): Promise<Pick<User, "fname" | "lname" | "mobileNo" | "location">> {
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

    async updateEmail(userId: string, email: string): Promise<void> {
        await UserModel.findOneAndUpdate({ userId },
            { $set: { email } }
        );
    }



    async toogleUserStatusById(userId: string, isBlocked: boolean): Promise<boolean> {
        const result = await UserModel.updateOne(
            { userId },
            { $set: { isBlocked } }
        );
        return result.modifiedCount > 0;
    }

    async updateRefreshTokenAndGetUser(userId: string, refreshToken: string): Promise<Omit<User, "password"> | null> {
        const result = await UserModel.findOneAndUpdate(
            { userId },
            { $set: { refreshToken } },
            { new: true },
        ).select("-password");
        return result;
    }

    async resetRefreshTokenById(userId: string, refreshToken: string = ""): Promise<boolean> {
        const result = await UserModel.updateOne(
            { userId },
            { $set: { refreshToken } }
        );
        return result.matchedCount > 0;
    }

    async clearTokensById(userId: string, fcmToken: string): Promise<boolean> {
        const result = await UserModel.findOneAndUpdate(
            { userId },
            {
                $set: { refreshToken: "" },
                $pull: { fcmTokens: { token: fcmToken } }
            },
            { new: true }
        );
        return result ? true : false;
    }

    async resetPasswordByEmail(email: string, password: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            { email },
            { $set: { password } }
        );
        return result.matchedCount > 0;
    }

    async findUsersWithFilters(
        options: { searchQuery: string; filter: string },
        currentPage: number, limit: number,
    ): Promise<{ data: Partial<User>[]; total: number }> {

        const { searchQuery, filter } = options;
        const match: Record<string, unknown> = { role: RoleEnum.Customer };

        if (searchQuery) {
            match.$or = [
                { fname: { $regex: searchQuery, $options: "i" } },
                { lname: { $regex: searchQuery, $options: "i" } }
            ];
        }

        if (filter === "blocked") {
            match.isBlocked = true;
        } else if (filter === "unblocked") {
            match.isBlocked = false;
        }

        const pipeline: PipelineStage[] = [
            { $match: match },
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    fname: 1,
                    lname: 1,
                    email: 1,
                    mobileNo: 1,
                    role: 1,
                    location: {
                        houseinfo: 1,
                        street: 1,
                        district: 1,
                        city: 1,
                        locality: 1,
                        state: 1,
                        postalCode: 1,
                        coordinates: 1
                    },
                    isBlocked: 1,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: (currentPage - 1) * limit },
                        { $limit: limit }
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ];

        const result = await UserModel.aggregate(pipeline).exec();

        const users = result[0]?.data ?? [];
        const total = result[0]?.total[0]?.count ?? 0;

        return { data: users, total };
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

        const pipeline: PipelineStage[] = [];
        const hasNearbyFilter = extraFilter?.nearByFilter && coordinates?.latitude && coordinates?.longitude;

        if (hasNearbyFilter) {
            let minDistance = 0;
            let maxDistance = Infinity;

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
                break;
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
            );

        }

        const sortCondition: Record<string, 1 | -1> = {};
        switch (filter) {
        case "name_asc":
            sortCondition["fname"] = 1;
            break;
        case "name_desc":
            sortCondition["fname"] = -1;
            break;
        case "rating_asc":
            sortCondition["averageRating"] = 1;
            break;
        case "rating_desc":
            sortCondition["averageRating"] = -1;
            break;
        case "price_asc":
            sortCondition["providerDetails.serviceCharge"] = 1;
            break;
        case "price_desc":
            sortCondition["providerDetails.serviceCharge"] = -1;
            break;
        default:
            sortCondition["averageRating"] = -1;
            break;

        }

        const matchUserConditions: Record<string, unknown> = {
            role: "provider",
            isBlocked: false,
        };

        if (searchQuery.trim()) {
            matchUserConditions.$or = [
                { "fname": { $regex: searchQuery, $options: "i" } },
                { "lname": { $regex: searchQuery, $options: "i" } },
            ];
        }

        //filter via service(category)
        const matchServiceCondition: Record<string, unknown> = {};
        matchServiceCondition["serviceDetails.isActive"] = true;
        if (extraFilter?.selectedService) {
            matchServiceCondition["serviceDetails.categoryId"] = extraFilter.selectedService;
        }

        // filter via rating
        const matchRatingCondition: Record<string, unknown> = {};
        if (extraFilter?.ratingFilter) {
            matchRatingCondition["averageRating"] = { $eq: extraFilter.ratingFilter };
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
                    from: "availabilities",
                    localField: "providerDetails.providerId",  //field in provider
                    foreignField: "providerId", //field in provider
                    as: "availabilityDetails",
                },
            }, { $unwind: "$availabilityDetails" },
            {
                $match: {
                    "availabilityDetails.workTime": {
                        $elemMatch: { active: true } // <-- Only keep if at least one slot is active
                    }
                }
            },
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
        );


        interface AggregatedFacetResult {
            data: {
                user: Pick<User, "userId" | "fname" | "lname">,
                provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
                category: Pick<Category, "categoryId" | "name" | "subcategories">
                averageRating: number, totalRatings: number;
            }[];
            totalCount: { total: number }[];
        }

        const result = await UserModel.aggregate<AggregatedFacetResult>(pipeline).exec();

        return {
            data: result[0].data || [],
            total: result[0].totalCount[0]?.total || 0
        };
    }

    async findProviderInfoById(providerId: string, coordinates: { latitude: number; longitude: number }): Promise<{
        user: Pick<User, "userId" | "fname" | "lname">,
        provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
        category: Pick<Category, "categoryId" | "name" | "subcategories">
        booking: Pick<Booking, "bookingId" | "scheduledAt" | "status">[]
        availability: Pick<Availability, "workTime">
        distanceFee: number
    }> {
        const matchConditions: Record<string, unknown> = {
            role: "provider",
            isBlocked: false,
            "providerDetails.providerId": providerId,
        };

        const pipeline: PipelineStage[] = [
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
                    as: "providerDetails"
                },
            },
            { $unwind: "$providerDetails" },
            { $match: matchConditions },
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
                    let: { providerId: "$providerDetails.providerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$provider.id", "$$providerId"] },
                                status: { $in: ["Confirmed", "Pending"] },
                                //scheduledAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                                scheduledAt: { $gte: new Date(new Date()) }
                            }
                        },
                        { $project: { bookingId: 1, scheduledAt: 1, status: 1, _id: 0 } }
                    ],
                    as: "bookingDetails"
                }
            },
            {
                $lookup: {
                    from: "availabilities",
                    localField: "providerDetails.providerId",
                    foreignField: "providerId",
                    as: "availabilityDetails"
                }
            }, { $unwind: "$availabilityDetails" },
            {
                $match: {
                    "availabilityDetails.workTime": {
                        $elemMatch: { active: true }
                    }
                }
            },
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
                                {
                                    case: { $and: [{ $gt: ["$distance", 15] }, { $lte: ["$distance", 20] }] },
                                    then: 90,
                                },
                            ],
                            default: 150, // For >15 km
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
                    availability: {
                        workTime: "$availabilityDetails.workTime"
                    },
                    booking: "$bookingDetails",
                    distanceFee: 1,
                }
            }
        ];

        interface AggregatedResult {
            user: Pick<User, "userId" | "fname" | "lname">,
            provider: Pick<Provider, "providerId" | "gender" | "profileImage" | "isOnline" | "serviceCharge">,
            category: Pick<Category, "categoryId" | "name" | "subcategories">
            booking: Pick<Booking, "bookingId" | "scheduledAt" | "status">[]
            availability: Pick<Availability, "workTime">
            distanceFee: number
        }

        const result = await UserModel.aggregate<AggregatedResult>(pipeline);
        return result[0];
    }


    async getServiceChargeWithDistanceFee(providerId: string, coordinates: { latitude: number; longitude: number; }): Promise<{ serviceCharge: number; distanceFee: number; } | null> {
        const matchConditions: Record<string, unknown> = {
            role: "provider",
            isBlocked: false,
            "providerDetails.providerId": providerId
        };
        const pipeline: PipelineStage[] = [
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
                    as: "providerDetails"
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
        ];
        interface AggregatedResult {
            serviceCharge: number;
            distanceFee: number;
        }

        const result = await UserModel.aggregate<AggregatedResult>(pipeline);
        return result[0];
    }

    async findByRole(Role: RoleEnum): Promise<User[]> {
        return UserModel.find({ role: Role });
    }

    async addFcmToken(userId: string, FcmToken: string, platform?: string): Promise<void> {
        await UserModel.updateOne(
            { userId },
            {
                $addToSet: {
                    fcmTokens: {
                        token: FcmToken,
                        platform,
                        createdAt: new Date(),
                    },
                },
            }
        );
    }

    async dashboardUserStats(start: Date, end: Date): Promise<{
        totalCustomers: number;
        blockedCustomers: number;
        newCustomers: number;
        totalProviders: number;
        blockedProviders: number;
        newProviders: number;
    }> {
        const [
            totalCustomers,
            blockedCustomers,
            newCustomers,
            totalProviders,
            blockedProviders,
            newProviders,
        ] = await Promise.all([
            UserModel.countDocuments({ role: RoleEnum.Customer }),
            UserModel.countDocuments({ role: RoleEnum.Customer, isBlocked: true }),
            UserModel.countDocuments({
                role: RoleEnum.Customer,
                createdAt: { $gte: start, $lte: end },
            }),
            UserModel.countDocuments({ role: RoleEnum.Provider }),
            UserModel.countDocuments({ role: RoleEnum.Provider, isBlocked: true }),
            UserModel.countDocuments({
                role: RoleEnum.Provider,
                createdAt: { $gte: start, $lte: end }, // instead of this create a roleUpdated field with date value and filter on this 
            }),
        ]);

        return {
            totalCustomers,
            blockedCustomers,
            newCustomers,
            totalProviders,
            blockedProviders,
            newProviders,
        };
    }
}



