//export const APP_NAME = 'FixOra';
export const BodyParserLimits = {
    JSON_LIMIT: '1mb',
    URLENCODED_LIMIT: '1mb',
};
export const BOOKING_REQUEST_TIMEOUT_MS = 
    process.env.NODE_ENV === "production" ? 5 * 60 * 1000  :  15 * 1000;     

// export const PAYMENT_TIMEOUT_MS =
//     process.env.NODE_ENV === "production" ? 15 * 60 * 1000 :  40 * 1000;





