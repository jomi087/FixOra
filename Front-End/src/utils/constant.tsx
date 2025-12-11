import { RoleEnum } from "@/shared/enums/roles";
import type { TimeRange } from "@/shared/types/dashboard";
import type { SalesPreset } from "@/shared/types/salesReport";
import {
  Home, Briefcase, Users, /*FileText,*/ User,
  CalendarCheck, MessageSquareText, Wallet,
  LayoutDashboard, Settings, Wrench, AlertTriangle,
  MessageSquareMore, ClipboardClock, CalendarClock, ChartNoAxesCombined
} from "lucide-react";

/******************************************************************************************************* */
export const App_Name: string = "FixOra";
export const Support_Mail: string = `support@${App_Name.toLocaleLowerCase()}.com`;
export const Support_Contact_No: string = "+91 7907728132";
export const CURRENT_YEAR = 2025;
export const COPYRIGHT_NOTICE = `© ${CURRENT_YEAR} ${App_Name}. All rights reserved.`;

/********************************************* Image Sections *******************************************************/
export const BGImage_404: string = "url('/images/404_Bg_Image.jpg')";  //used in sign-in, sign-up, pagenot-found,
export const HeroSectionImage: string = "/images/hero-removebg-preview.png";
export const SingInThemeImage: string = "/images/signIn.png";
export const ApprovedSeal: string = "/images/approved.png";
export const RejectSeal: string = "/images/rejected.png";
export const ConfirmSeal: string = "/images/completedStamp.png";
export const CancelSeal: string = "/images/cancelledSeal.png";

/********************************************* Rules  *******************************************************/
export const PAYMENT_SESSION_TIMEOUT_MS = Number(import.meta.env.VITE_PAYMENT_TIMEOUT_MS);

export const searchInputLength: number = 30; //50
export const shortInputLength: number = 50; //50
export const longInputLength: number = 200;  //200

export const categoryImageSize: number = 1;                                 //default set  to 2 mb
export const providerImageSize: number = 1;                                 //default set  to 2 mb
export const KYCImageSize: number = 5; //default set  to 5 mb
export const ImageSize: number = 5;    //default set  to 5 mb
export const minYear = `${new Date().getFullYear() - 150}-01-01`;
export const maxYear = `${new Date().getFullYear() - 19}-01-01`;
export const CCPP = 8;                                                  //CCPP => Customer Cards Per page -> default set to 16
export const PCPP = 8;                                                  //PCPP => Provider Cards Per page  -> default set to 16
export const PALPP = 10;                                                //PALPP => Provider Application List Per Page  -> default set to 15
export const SLPP = 7;                                                  //SLPP => Service list Per page -> default set to 10
export const BHPP = 7;                                                  //BHPP => Booking History Per Page  -> default set to 10
export const TLPP = 5;                                                  //TLPP => Transaction List Per Page -> default set to 10
export const RLPP = 5;                                                  //RLPP => Review List Per Page
export const DLPP = 10;                                                 //DLPP => Dispute List Per Page
export const MPP = 50;                                                  //MPP => Messages per page
export const DATE_RANGE_DAYS = 365;
export const ONE_WEEK = 7;
export const TIME_SLOTS = {
  STARTHOURS: 0,
  ENDHOURS: 23,
  INTERVAL: 60,
};
/******************************************* Messages *******************************************************/
export const Messages = {
  FAILED_CATEGORY_RESPONSE_MSG: "Failed to add category",
  FAILED_TO_FETCH_ADDRESS_CORDINATES: "Failed to fetch address from coordinates",
  FAILED_TO_FETCH_CORDINATES: "Failed to fetch coordinates",
  FAILED_TO_FETCH_DATA: "Failed to fetch data",
  FAILED_TO_SAVE_DATA: "Failed to save data",
  MAIL_SENT_MSG: "A Verification mail has been sent to your mail",
  FAILED_PASSWORD_VERIFICATION: "Password verification Failed",
  KYC_SUBMITTED_SUCCESS: "KYC submitted successfully!",
  FAILED_TO_SUBMIT_KYC: "Failed to submit KYC",
  PROFILE_MODIFICATION_FAILED: "Profile modification failed",
  LOGIN_FAILED: "Login failed. Please try again later",
  FAILED_FETCH_POSTAL_INFO: "Failed to fetch postal info. Please try again later",
  PASSWORD_UPDATED_SUCCESS: "Password updated successfully!",
  PASSWORD_UPDATE_FAILED: "Password updation failed",
  OTP_VERIFIED_SUCCESS: "OTP verified successfully!",
  OTP_VERIFICATION_FAILED: "Failed to verify OTP. Please try again.",
  OTP_SENT_SUCCESS: "OTP has been sent to your mail!",
  OTP_RESENT_FAILED: "Failed to resend OTP. Please try again.",
  PASSWORD_RESET_SUCCESS: "Password reset successful!",
  PASSWORD_RESET_FAILED: "Password reset failed",
  FAILED_TO_FETCH_CATEGORY: "Failed to fetch Category",
  SIGNIN_SUCCESS: "Sign-in successful!",
  FORGOT_PASSWORD_FAILED: "Forgot Password Failed",
  ACCOUNT_CREATION_FAILED: "Account Creation failed",
  FAILED_TO_UPDATE_STATUS: "Failed to update status",
  INVALID_OR_UNAVAILABLE_PINCODE: "Invalid or unavailable Pincode",
  NETWORK_ERROR_FETCHING_POSTAL_INFO: "Network error while fetching postal info",
  BOOKING_STATUS_FAILED: "Failed to update booking status",
  ACCESS_DENID: "You don't have permission to access this resource.",
  STRIPE_FAILED: "Stripe failed to initialize",
  PAYMENT_FAILED: "Payment Failed, Try again",


  //move to validation section
  SERVICE_REQUIRED: "Service required",
  DOB_REQUIRED: "Date of birth is required",
  SERVICE_CHARGE_RANGE: "Service charge must be between 300 and 500",
  SELECT_SPECIALIZATION: "Select at least one specialization",
  SERVICE_CHARGE_REQUIRED: "Service charge is required",
  EXPERIENCE_CERT_INVALID: "Experience certificate must be a valid JPG/PNG <= 5MB",
  GENDER_REQUIRED: "Select a gender",
  IMAGE_TYPE_INVALID: "Only JPEG, PNG, or JPG images are allowed.",
};

export const validationMsg = {
  ISSUE_TYPE_REQUIRED: "Issue Type is required.",
  ISSUE_DESCRIPTION_REQUIRED: "Please describe the issue.",
  INVALID: "Feild Required",
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required.`,
};

export const placeHolder = {
  ISSUE_TYPE: "Select issue type",
  ISSUE_DESCRIPTION: "Briefly describe the problem you're facing"
};
/******************************************* Reset Password Constraints Sections *******************************************************/
export const constraints = [
  { label: "At least 10 characters", test: (pw: string) => pw.length >= 10 },
  // { label: "At least one capital letter", test: (pw: string) => /[A-Z]/.test(pw) },
  // { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
  // { label: "At least one symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];
/******************************Navigation Items for the User navigation bar ********************************/
export const navItems = [
  { name: "Home", to: "/", icon: <Home size={18} /> },
  { name: "Services", to: "/customer/services", icon: <Briefcase size={18} /> },
  { name: "Providers", to: "/customer/providers", icon: <Users size={18} /> },
  // { name: "Blog", to: "/customer/blog", icon: <FileText size={18} /> },
  { name: "Account", to: "/customer/account/profile", icon: <User size={18} /> }
];
/********************************************* Side-Bar Sections *******************************************************/
export interface SideBarOption {
  icon: React.ElementType;
  section: string;
  to?: string;
  children?: SideBarOption[];
}

//User Side Bar
export const userSideBarOptions: SideBarOption[] = [
  { icon: User, section: "Profile", to: "/customer/account/profile" },
  { icon: CalendarCheck, section: "Bookings", to: "/customer/account/bookings" },
  { icon: MessageSquareText, section: "Chats", to: "/customer/account/chats" },
  { icon: Wallet, section: "Wallet", to: "/customer/account/wallet" },
];

//provider Side Bar
export const providerSideBarOptions: SideBarOption[] = [
  { icon: LayoutDashboard, section: "Dashboard", to: "/provider/dashboard" },
  { icon: MessageSquareMore, section: "Chat", to: "/provider/chats" },
  { icon: Wallet, section: "Wallet", to: "/provider/wallet" },
  { icon: ClipboardClock, section: "History", to: "/provider/booking-history" },
  {
    icon: Settings,
    section: "Settings",
    children: [
      { icon: User, section: "Profile", to: "/provider/settings/profile" },
      { icon: CalendarClock, section: "Availability", to: "/provider/settings/availability" },
      { icon: ChartNoAxesCombined, section: "Sales", to: "/provider/settings/sales" }

    ]
  },
];

//Admins Side Bar
export const adminSideBarOptions: SideBarOption[] = [
  { icon: LayoutDashboard, section: "Dashboard", to: "/admin/dashboard" },
  { icon: Users, section: "Users", to: "/admin/users" },
  { icon: Users, section: "Providers", to: "/admin/providers" },
  { icon: Wrench, section: "Services", to: "/admin/services" },
  { icon: AlertTriangle, section: "Dispute", to: "/admin/disputes" },
  { icon: Settings, section: "Settings", to: "/admin/settings" },
];


export const settingOptions: { section: string; to: string }[] = [
  { section: "Profile", to: "/admin/settings/profile" },
  { section: "Commission Fee", to: "/admin/settings/commission-fee" },
];

/*********************************************************************************************************************************************************/
export const providers: Array<string> = ["/images/provider1.jpg", "/images/provider1.jpg", "/images/provider1.jpg"];

interface BlogPost {
  title: string;
  description: string;
  image: string;
  author: string;     // new
  date: string;       // new (ISO or readable format)
}

/********************************************************************************************************************************************************* */

// constants/apiRoutes.ts
export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    SIGNIN: "/api/auth/signin",
    GOOGLE_SIGNIN: "/api/auth/google-signin",
    VERIFY_OTP: "/api/auth/verify-otp",
    RESEND_OTP: "/api/auth/resend-otp",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    CHECK_STATUS: "/api/auth/check",
    SIGNOUT: "/api/auth/signout",
  },

  NOTIFICATIONS: {
    GET_ALL: "/api/notifications",
    ACKNOWLEDGE: (id: string) => `/api/notification/acknowledge/${id}`,
  },

  CHAT: {
    LIST: (role: RoleEnum) => `/api/${role}/chats`,
    MESSAGES: (role: RoleEnum, chatId: string) => `/api/${role}/chats/${chatId}/messages`,
    CALL_LOGS: (role: RoleEnum, chatId:string) => `/api/${role}/chats/${chatId}/call-log`
  },

  CUSTOMER: {
    SERVICES: "/api/customer/services",

    REVERSE_GEOCODE: "/api/customer/geocode/reverse",
    AUTO_COMPLETE_SEARCH: "/api/customer/geocode/search",
    FORWARD_GEOCODE: "/api/customer/geocode/forward",
    
    SAVE_LOCATION: "/api/customer/save-location",
    
    PROVIDERS: "/api/customer/providers",
    PROVIDER_KYC: "/api/customer/provider-kyc",

    PROVIDER_BOOKINGS: (id: string) => `/api/customer/provider/bookings/${id}`,

    PROVIDER_REVIEWS: (id: string) => `/api/customer/provider/${id}/reviews`,
    FEEDBACK: "/api/customer/booking/review",
    REPORT_FEEDBACK: "/api/customer/review/dispute",
    REVIEW_STATUS: (id: string) => `/api/customer/booking/review-status/${id}`,

    BOOKING_APPLICATION: "/api/customer/provider/booking",
    RESCHEDULE_BOOKING: (bookingId: string) => `/api/customer/reschedule/booking/${bookingId}`,
    ONLINE_PAYMENT: "/api/customer/create-checkout-session",
    WALLET_PAYMENT: "/api/customer/wallet-payment",
    PAYMENT_STATUS: (bookingId: string) => `/api/customer/booking/notify-paymentStatus/${bookingId}`,
    UPDATE_EMAIL_REQUEST: "/api/customer/email/update/request",
    UPDATE_EMAIL: "/api/customer/email/update/confirm",
    EDIT_PROFILE: "/api/customer/editProfile",
    VERIFY_PASSWORD: "/api/customer/verifyPassword",
    CHANGE_PASSWORD: "/api/customer/change-password",
    BOOKING_HISTORY: "/api/customer/booking-history",
    BOOKING_DETAILS: (id: string) => `/api/customer/bookingDetails/${id}`,
    RETRY_AVAILABILITY: (id: string) => `/api/customer/booking/retry-availability/${id}`,
    CANCEL_BOOKING: (id: string) => `/api/customer/booking/cancel-booking/${id}`,
    WALLET_INFO: (page: number, limit: number) =>
      `/api/customer/wallet?page=${page}&limit=${limit}`,
    ADD_FUND: "/api/customer/wallet/add-fund",
  },

  PROVIDER: {
    PENDING_BOOKING_REQUEST: "/api/provider/booking-request",
    UPDATE_BOOKING_STATUS: (id: string) => `/api/provider/booking/${id}/status`,
    CONFIRM_BOOKINGS: "/api/provider/confirm-bookings",
    JOB_DETAILS: (id: string) => `/api/provider/jobDetails/${id}`,
    JOB_HISTORY: "/api/provider/job-history",
    ARRIVAL_OTP: (id: string) => `/api/provider/arrival-otp/${id}`,
    VERIFY_ARRIVAL_OTP: "api/provider/verify-arrivalOtp",
    FINALIZE_BOOKING: "/api/provider/acknowledge-completion",
    PROVIDER_DATA: "/api/provider/provider-data",
    PROVIDERSERVICES: "/api/provider/provider-services",
    WORKING_TIME_INFO: "/api/provider/availability-time",
    SCHEDULE_WORK_TIME: "api/provider/schedule-availability-time",
    TOGGLE_AVAILABILITY: "api/provider/toggle-availability",
    SALES_REPORT: (filter: SalesPreset | null, startDate: string | null, endDate: string | null) => {
      let url = "/api/provider/generate-salesReport";
      if (filter) {
        url += `?filter=${filter}`;
      } else if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return url;
    },
  },

  ADMIN: {
    DASHBOARD: (timeRange: TimeRange) => `/api/admin/dashboard?range=${timeRange}`,

    CUSTOMER_MANAGEMENT: "/api/admin/customers",

    PROVIDER_MANAGEMENT: "/api/admin/providers",
    PROVIDER_APPLICATION_LIST: "/api/admin/provider-applicationList",
    PROVIDER_KYC: (id: string) => `/api/admin/provider-kyc/${id}`,

    TOGGLE_USER_STATUS: (userId: string) => `/api/admin/users/${userId}/status`,

    CATEGORY_MANAGEMENT: "/api/admin/services",
    TOGGLE_CATEGORY_STATUS: (id: string) => `/api/admin/services/${id}/status`,

    DISPUTE_MANAGEMENT: "/api/admin/disputes",
    DISPUTE_CONTENT_INFO: (id: string) => `/api/admin/disputes/${id}/content`,
    DISPUTE_ACTION: (id: string) => `/api/admin/disputes/${id}/action`,

    COMMISSION_FEE: "/api/admin/commission-fee",
  },

  LANDING: {
    GET_DATA: "/api/landing-data",
  },
};

//Pie Chart Colour
const baseColors = [
  "#3b82f6", //  (Blue)
  "#10b981", //  (Green)
  "#f59e0b", //  (Amber)
  "#ef4444", //  (Red)
  "#8b5cf6", //  (Violet)
  "#14b8a6", //  (Teal)
  "#e11d48", //  (Rose)

  "#6366f1", // Future Service (Indigo)
  "#22c55e", // Future Service (Emerald)
  "#ec4899", // Future Service (Pink)
  "#f97316", // Future Service (Orange)
  "#0ea5e9", // Future Service (Sky Blue)
  "#84cc16", // Future Service (Lime)
  "#a855f7", // Future Service (Purple)
  "#f43f5e", // Future Service (Crimson)
  "#06b6d4", // Future Service (Cyan)
  "#d946ef", // Future Service (Fuchsia)
  "#eab308", // Future Service (Yellow)
];
export const getServiceColor = (index: number) => baseColors[index % baseColors.length];
/********************************************************************************************************************************************************** */

export const blogPosts: Array<BlogPost> = [
  {
    title: "10 Signs Your Washing Machine Needs a Check-Up",
    description:
      "Strange noises, leaks, or poor cleaning performance? Discover the most common symptoms that indicate your washing machine needs professional servicing.",
    image: "https://placehold.co/400",
    author: "Provider A",
    date: "2025-05-01",
  },
  {
    title: "Top Electrical Issues in Homes — And How to Avoid Them",
    description:
      "From frequent power trips to flickering lights, learn about the common electrical problems that need attention from a certified electrician.",
    image: "https://placehold.co/400",
    author: "Provider B",
    date: "2025-05-03",
  },
  {
    title: "Leaky Faucets to Major Repairs: Your Plumbing Survival Guide",
    description:
      "Plumbing issues can escalatitudee quickly. Here’s how to identify early warning signs and when to call in a professional.",
    image: "https://placehold.co/400",
    author: "Provider C",
    date: "2025-05-05",
  },
  {
    title: "Why Regular Appliance Maintenance Saves You Money",
    description:
      "Routine servicing extends appliance life, improves performance, and helps avoid costly breakdowns. Here's what every homeowner should know.",
    image: "https://placehold.co/400",
    author: "Provider A",
    date: "2025-05-07",
  },
];
/*************************************************************************************** */

export const dummyChats: any[] = [
  { id: "1", name: "Soman", message: "Mrngg jomu", time: "8:55 AM", unread: 0 },
  { id: "2", name: "BCR62 April 2024", message: "You reacted 👍", time: "4:10 PM", unread: 0 },
  { id: "3", name: "Communication BCR62", message: "Session Report...", time: "2:22 PM", unread: 0 },
  { id: "4", name: "ANSAR BROTOTYPE", message: "✔✔ And video call ui also", time: "5:09 PM", unread: 5 },
  { id: "5", name: "MJ Boys 🌱", message: "📷 Video", time: "4:41 PM", unread: 0 },
  { id: "6", name: "Alphonsa Kids 👶", message: "Gd evng ❤️", time: "6:12 PM", unread: 0 },
  { id: "7", name: "Family Group 👨‍👩‍👧", message: "Dinner at 8 PM", time: "7:01 PM", unread: 1 },
  { id: "8", name: "Office Team 💼", message: "Meeting postponed", time: "3:14 PM", unread: 0 },
  { id: "9", name: "John Doe", message: "Check this out!", time: "11:45 AM", unread: 0 },
  { id: "10", name: "Project Group 🚀", message: "Updated the docs", time: "10:36 AM", unread: 3 },
  { id: "11", name: "Brototype Batch", message: "Next session link", time: "4:59 PM", unread: 0 },
  { id: "12", name: "Travel Buddies ✈️", message: "Trip confirmed!", time: "1:22 PM", unread: 0 },
  { id: "13", name: "College Mates 🎓", message: "Plan for weekend?", time: "9:18 AM", unread: 0 },
  { id: "14", name: "Cricket Team 🏏", message: "Practice today?", time: "5:45 PM", unread: 0 },
  { id: "15", name: "Gym Partner 💪", message: "Leg day🔥", time: "8:10 AM", unread: 0 },
];

export const sampleMessages: any[] = [
  { id: "1", content: "Hey! How are you?", sender: "them", createdAt: "8:50 AM" },
  { id: "2", content: "I'm good! Just working on some projects", sender: "me", createdAt: "8:52 AM" },
  { id: "3", content: "That's great! What are you working on?", sender: "them", createdAt: "8:53 AM" },
  { id: "4", content: "Building a chat interface with React", sender: "me", createdAt: "8:54 AM" },
  { id: "5", content: "Mrngg jomu", sender: "them", createdAt: "8:55 AM" },

  // New dummy data
  { id: "6", content: "Nicee! React can be fun 😄", sender: "them", createdAt: "8:56 AM" },
  { id: "7", content: "Yeah, once the components start coming together, it feels great!", sender: "me", createdAt: "8:57 AM" },
  { id: "8", content: "Are you also adding animations?", sender: "them", createdAt: "8:58 AM" },
  { id: "9", content: "Yep! Planning to add smooth transitions and typing indicators", sender: "me", createdAt: "9:00 AM" },
  { id: "10", content: "That's awesome! Can't wait to see it", sender: "them", createdAt: "9:02 AM" },

  { id: "11", content: "I’ll send you a demo link soon 🔗", sender: "me", createdAt: "9:05 AM" },
  { id: "12", content: "Btw did you have breakfast?", sender: "them", createdAt: "9:06 AM" },
  { id: "13", content: "Not yet, totally forgot 😅", sender: "me", createdAt: "9:07 AM" },
  { id: "14", content: "Bruhhh go eat something 😂", sender: "them", createdAt: "9:08 AM" },
  { id: "15", content: "Okay finee I'll make coffee first ☕", sender: "me", createdAt: "9:10 AM" },

  { id: "16", content: "Coffee doesn't count as breakfast 😭", sender: "them", createdAt: "9:11 AM" },
  { id: "17", content: "It does in my world 😌", sender: "me", createdAt: "9:12 AM" },
  { id: "18", content: "Anyway do you need help with the UI?", sender: "them", createdAt: "9:15 AM" },
  { id: "19", content: "Maybe later! Still structuring the components", sender: "me", createdAt: "9:17 AM" },
  { id: "20", content: "Cool, just ping me", sender: "them", createdAt: "9:18 AM" }
];