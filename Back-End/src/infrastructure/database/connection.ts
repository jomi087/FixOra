import mongoose from "mongoose";
import { ILoggerService } from "../../domain/interface/ServiceInterface/ILoggerService";

const mongoConnect = async (logger: ILoggerService): Promise<void> => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/fixora";

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000, // wait max 5s for server selection
        });
        logger.info("Connected to MongoDB");
    } catch (error: unknown) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        logger.error("Failed to connect to MongoDB", {
            message: errorObj.message,
            stack: errorObj.stack,
        });
        process.exit(1);
    }

    // Log future connection issues
    mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
    });
};

export default mongoConnect;



