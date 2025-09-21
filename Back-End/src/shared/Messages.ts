export const Messages = {
    ACCOUNT_BLOCKED: "Account Blocked, Contanct support",
    ACCOUNT_CREATED_SUCCESS: "Account created successfully",

    OTP_EXPIRED: "OTP Expired, Click Re-Send OTP",
    OTP_SENT: "OTP sent to your mail",

    SIGNIN_SUCCESSFUL: "Signin successful",
    VERIFICATION_MAIL_SENT: "Verification mail sent to your mail",
    PASSWORD_RESET_SUCCESS: "Password reset successful",
    IMAGE_VALIDATION_ERROR: "Image validation error",
    PROFILE_UPDATED_SUCCESS: "Profile updated successfully",

    USER_NOT_FOUND: "User Not Found",
    BOOKING_ID_NOT_FOUND: "BookingId Not Found",
    WALLET_ID_NOT_FOUND: "Wallet Not Found",
    EMAIL_NOT_FOUND: "Email Not Found",
    PROVIDER_NOT_FOUND: "Provider Not Found",
    NOT_FOUND_MSG: "Data Not Found",

    ADD_ADDRESS: "Please add an Address",

    EMAIL_ALREADY_EXISTS: "Email already exists",
    CATEGORY_ALREADY_EXISTS: "Category name already exists",
    PROVIDER_ALREADY_EXISTS: "Provider already exists",
    ALREADY_UPDATED: "Already Updated",

    CATEGORY_NAME_REQUIRED: "Category name is required",
    CATEGORY_DESCRIPTION_REQUIRED: "Category description is required",
    INVALID_SUBCATEGORIES_JSON: "Invalid subcategories JSON",
    AT_LEAST_ONE_SUBCATEGORY_REQUIRED: "At least one subcategory is required",
    SUBCATEGORY_NAME_REQUIRED: (index: number) => `Subcategory ${index + 1} name is required`,
    SUBCATEGORY_DESCRIPTION_REQUIRED: (index: number) => `Subcategory ${index + 1} description is required`,

    MAIN_CATEGORY_IMAGE_MISSING: "Main category image missing",
    SUBCATEGORY_IMAGE_MISSING: "Subcategory image missing",
    CATEGORY_CREATED_SUCCESS: "Category created successfully",

    KYC_REQUEST_STATUS: (result: "submitted" | "resubmitted") => `KYC request ${result} successfully. You’ll be notified after verification.`,
    KYC_NOT_FOUND: "KYC request not found",
    KYC_ALREADY_REVIEWED: "This KYC request is already reviewed",
    KYC_REJECTED: "KYC Request rejected successfully",
    KYC_APPROVED: "KYC Request Approved successfully",
    PENDING_KYC_REQUEST: "You already have a pending KYC request. Please wait for admin review.",
    KYC_ALREADY_APPROVED: "Your KYC is already approved. No need to reapply.",

    SUBMITTED_BOOKING_REQUEST: "Booking request submitted",
    ALREDY_BOOKED: "Slot is already booked",
    PENDING_BOOKING: "Another booking is pending for this slot",
    SLOT_TIME_PASSED: "Slot unavailable - scheduled time has passed",

    PROVIDER_NO_RESPONSE: "No response from provider",
    PAYMENT_TIMEOUT_MSG: "Payment TimeOut",

    DATA_MISMATCH: "Data mismatch found.",
    INSUFFICIENT_BALANCE: "Insufficient Balance",

    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_ROLE: "Invalid role",
    INVALID_PASSWORD: "Invalid Password",
    INVALID_OTP: "Invalid OTP",
    INVALID_REFRESH_TOKEN: "Invalid refresh token",
    INVALID_TOKEN: "Invalid token",
    INVALID_ACTION: "Invalid Action",
    INVALID_GENDER: "Gender must be Male, Female, or Other",
    INVALID_SPECIALIZATION: "Invalid specialization",
    INVALID_DOB: "Invalid date of birth",
    INVALID_FORMAT: "Invalid Format",

    TOKEN_EXPIRED: "Token expired",
    MISSING_TOKEN: "Missing token",
    TOKENS_REFRESHED_SUCCESS: "Tokens refreshed successfully",

    FIELD_REQUIRED: "Field is required",
    VALIDATION_FAILED: "Validation failed",
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
    SERVICE_REQUIRED: "Service required",
    DOB_REQUIRED: "Date of birth is required",
    SERVICE_CHARGE_RANGE: "Service charge must be between 300 and 500",
    AGE_RESTRICTED: "Age restricted: must be at least 18",
    REASON_REQUIRED_ON_REJECTION: "Reason is required when rejecting",

    INTERNAL_ERROR: "Something went wrong. Please try again later",
    UNAUTHORIZED_MSG: "Unauthorized",
    FORBIDDEN_MSG: "Access denied",

    LOGGED_OUT: "Logged Out",

} as const;