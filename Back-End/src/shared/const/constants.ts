export const BRAND = {
    NAME: "FixOra",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5001",
    LOGO_URL: `${process.env.FRONTEND_URL?.replace(/\/$/, "")}/images/fixoraLogo.png`,
};

export const BodyParserLimits = {
    JSON_LIMIT: "1mb",
    URLENCODED_LIMIT: "1mb",
};

export const LANDING_PAGE_TOP_PROVIDERS_LIMIT = 5;

export const BOOKING_REQUEST_TIMEOUT_MS = 
    process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 1 * 60 * 1000;

export const PAYMENT_SESSION_TIMEOUT =
    process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 1 * 60 * 1000;

export const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

export const maxSizeMB = 5;

export const FULL_REFUND_WINDOW_MINUTES = 15;

export const PARTIAL_REFUND_PERCENTAGE = 0.5;

//intial fee
export const COMMISSION_FEE = 30;

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const LEAVE_OPTIONS = ["this_week", "every_week"];
export const PLATFORMS = ["web", "app"] as const;


