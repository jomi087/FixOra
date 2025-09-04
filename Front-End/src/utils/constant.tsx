import {
  Home, Briefcase, Users, FileText, User,
  CalendarCheck, MessageSquareText, Wallet, ShieldAlert,
  LayoutDashboard, Settings, BarChartBig, Wrench, AlertTriangle,
  MessageSquareMore, Scroll, ClipboardClock  
} from "lucide-react";



/******************************************************************************************************* */
export const App_Name:string = "FixOra";
export const Support_Mail: string = `support@${App_Name.toLocaleLowerCase()}.com`;
export const Support_Contact_No: string = "+91 7907728132";
export const CURRENT_YEAR = 2025;
export const COPYRIGHT_NOTICE = `© ${CURRENT_YEAR} ${App_Name}. All rights reserved.`;

/********************************************* Image Sections *******************************************************/
export const BGImage_404: string = "url('/404_Bg_Image.jpg')";  //used in sign-in, sign-up, pagenot-found,
export const HeroSectionImage:string = "/hero-removebg-preview.png";
export const SingInThemeImage: string = "/signIn.png";
export const ApprovedSeal: string = "/approved.png";
export const RejectSeal: string = "/rejected.png";
export const ConfirmSeal: string = "/completedStamp.png";

/********************************************* Rules  *******************************************************/

export const searchInputLength: number = 20; //50
export const shortInputLength: number = 20; //50
export const longInputLength: number = 40;  //200

export const categoryImageSize: number = 1;                                 //default set  to 2 mb
export const providerImageSize: number = 1;                                 //default set  to 2 mb
export const KYCImageSize : number = 5;                                     //default set  to 5 mb
export const minYear = `${new Date().getFullYear() - 150}-01-01`; 
export const maxYear = `${new Date().getFullYear() - 19}-01-01`;
export const CCPP = 8;                                                    //CCPP => Customer Cards Per page -> default set to 16
export const PCPP = 8;                                                   //PCPP => Provider Cards Per page  -> default set to 16
export const PALPP = 10;                                                 //PALPP => Provider Application List Per Page  -> default set to 15
export const SLPP = 7;                                                  //SLPP => Service list Per page -> default set to 10
export const BHPP = 7;
export const DATE_RANGE_DAYS = 7;
export const TIME_SLOTS = {
  STARTHOURS: 8,
  ENDHOURS: 18,
  INTERVAL : 60,
};


/******************************************* Messages *******************************************************/
export const Messages = {
  FAILED_CATEGORY_RESPONSE_MSG: "Failed to add category",
  FAILED_TO_FETCH_ADDRESS_CORDINATES : "Failed to fetch address from coordinates",
  FAILED_TO_FETCH_CORDINATES : "Failed to fetch coordinates",
  FAILED_TO_FETCH_DATA: "Failed to fetch data",
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
  STRIPE_FAILED:"Stripe failed to initialize",
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
  ISSUE_TYPE_REQUIRED : "Issue Type is required.",
  ISSUE_DESCRIPTION_REQUIRED: "Please describe the issue.",
  REASON_INVALID: "Please enter a valid Reason"
};

export const placeHolder = {
  ISSUE_TYPE : "Select issue type", 
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
  { name: "Home", to: "/", icon: <Home size={18} /> } ,
  { name: "Services", to: "/user/services", icon: <Briefcase size={18} /> },
  { name: "Providers", to: "/user/providers", icon: <Users size={18} /> },
  { name: "Blog", to: "/user/blog", icon: <FileText size={18} /> },
  { name : "Account" , to: "/user/account/profile", icon: <User  size={18} /> }
];
/********************************************* Side-Bar Sections *******************************************************/
export interface SideBarOption {
  icon: React.ElementType;
  section: string;
  to: string;
}

//User Side Bar
export const userSideBarOptions: SideBarOption[] = [
  { icon: User, section: "Profile", to: "/user/account/profile" },
  { icon: CalendarCheck, section: "Booking", to: "/user/account/booking" },
  { icon: MessageSquareText, section: "Chats", to: "/user/account/chats" },
  { icon: Wallet, section: "Wallet", to: "/user/account/wallet" },
  { icon: ShieldAlert, section: "Dispute", to: "/user/account/dispute" },
];

//provider Side Bar
export const providerSideBarOptions: SideBarOption[] = [
  { icon: LayoutDashboard, section: "Dashboard", to: "/provider/dashboard" },
  { icon: MessageSquareMore , section: "Chat", to: "/provider/chats" },
  { icon: Wallet , section: "Wallet", to: "/provider/wallet" },
  { icon: Scroll, section: "Blogs", to: "/provider/blogs" },
  { icon: ClipboardClock, section: "History", to: "/provider/booking-history" },
  { icon: User, section: "Profile", to: "/provider/profile" },
];


//Admins Side Bar
export const adminSideBarOptions: SideBarOption[] = [
  { icon: LayoutDashboard, section: "Dashboard", to: "/admin/dashboard" },
  { icon: Users, section: "Users", to: "/admin/users" },
  { icon: Settings, section: "Providers", to: "/admin/providers" },
  { icon: BarChartBig, section: "Sales", to: "/admin/sales" },
  { icon: Wrench, section: "Services", to: "/admin/services" },
  { icon: AlertTriangle, section: "Dispute", to: "/admin/dispute" },
];

/*********************************************************************************************************************************************************/
export const providers: Array<string> = ["/provider1.jpg", "/provider1.jpg", "/provider1.jpg"];

interface BlogPost {
  title: string;
  description: string;
  image: string;
  author: string;     // new
  date: string;       // new (ISO or readable format)
}

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
