import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

/* SOFT — browsing, search, lists*/
const softLimiter = new RateLimiterMemory({
    points: 1000,      // requests
    duration: 15 * 60, // per 15 minutes
});

/*  MEDIUM — updates, toggles */
const mediumLimiter = new RateLimiterMemory({
    points: 200,
    duration: 15 * 60,
});

/* STRICT — auth, OTP, payments */
const strictLimiter = new RateLimiterMemory({
    points: 5,
    duration: 10 * 60,
});

const chatSendLimiter = new RateLimiterMemory({
    points: 30,    
    duration: 60,  // per minute
});

function rateLimitMiddleware(limiter: RateLimiterMemory) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Key strategy — for guest IP and for signup user userid
            const key =
                req.user?.userId ? String(req.user.userId) : req.ip ?? "unknown-ip";

            await limiter.consume(key);
            next();
        } catch {
            res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
            });
        }
    };
}

export const softRateLimit = rateLimitMiddleware(softLimiter);
export const mediumRateLimit = rateLimitMiddleware(mediumLimiter);
export const strictRateLimit = rateLimitMiddleware(strictLimiter);
export const chatSendRateLimit = rateLimitMiddleware(chatSendLimiter);
