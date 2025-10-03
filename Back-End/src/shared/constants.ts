//export const APP_NAME = 'FixOra';
export const BodyParserLimits = {
    JSON_LIMIT: "1mb",
    URLENCODED_LIMIT: "1mb",
};
export const BOOKING_REQUEST_TIMEOUT_MS =
    process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 15 * 1000;

export const PAYMENT_SESSION_TIMEOUT =
    process.env.NODE_ENV === "production" ? 15 * 60 * 1000 : 60 * 1000;


export const FULL_REFUND_WINDOW_MINUTES = 15;

export const PARTIAL_REFUND_PERCENTAGE = 0.5;

export const PLATFORM_FEE = 30;

export const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;
export const leaveOptions = ["this_week" , "every_week"];

