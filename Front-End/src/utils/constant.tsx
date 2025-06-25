import type { CustromersData } from "@/shared/Types/user";
import {
  Home, Briefcase, Users, FileText, User,
  CalendarCheck, MessageSquareText, Wallet, ShieldAlert,
  LayoutDashboard, Settings, BarChartBig, Wrench, AlertTriangle,
} from "lucide-react";

/********************************************* Image Sections *******************************************************/
export const BGImage_404: string = "url('/404_Bg_Image.jpg')"  //used in sign-in, sign-up, pagenot-found,
export const HeroSectionImage:string = "/Hero-removebg-preview.png"
export const SingInThemeImage:string  = "/signIn.png"

/******************************************* Reset Password Constraints Sections *******************************************************/
export const constraints = [
    { label: "At least 10 characters", test: (pw: string) => pw.length >= 10 },
    // { label: "At least one capital letter", test: (pw: string) => /[A-Z]/.test(pw) },
    // { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
    // { label: "At least one symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

/******************************Navigation Items for the User navigation bar ********************************/
export const navItems = [
  { name: 'Home', to: '/', icon: <Home size={18} />} ,
  { name: 'Services', to: '/user/services', icon: <Briefcase size={18} /> },
  { name: 'Providers', to: '/user/providers', icon: <Users size={18} />},
  { name: 'Blog', to: '/user/blog', icon: <FileText size={18} /> },
  { name : 'Account' , to: '/user/account/profile', icon: <User  size={18} />}
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


//Admins Side Bar
export const adminSideBarOptions: SideBarOption[] = [
  { icon: LayoutDashboard, section: "Dashboard", to: "/admin/dashboard" },
  { icon: Users, section: "Users", to: "/admin/users" },
  { icon: Settings, section: "Providers", to: "/admin/providers" },
  { icon: BarChartBig, section: "Sales", to: "/admin/sales" },
  { icon: Wrench, section: "Services", to: "/admin/services" },
  { icon: AlertTriangle, section: "Dispute", to: "/admin/dispute" },
];



/********************************************************************************************************************************************************* */
//temp user Data 
export let customersData:CustromersData[] = [
  {
    "fname": "Alice",
    "lname": "Johnson",
    "email": "alice.johnson@example.com",
    "mobileNo": "9876543210",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Bob",
    "lname": "Smith",
    "email": "bob.smith@example.com",
    "mobileNo": "9876543211",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Charlie",
    "lname": "Brown",
    "email": "charlie.brown@example.com",
    "mobileNo": "9123456789",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Diana",
    "lname": "Lee",
    "email": "diana.lee@example.com",
    "mobileNo": "9123456790",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Ethan",
    "lname": "Wills",
    "email": "ethan.wills@example.com",
    "mobileNo": "9988776655",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Aswin",
    "lname": "George",
    "email": "aswin.george@example.com",
    "mobileNo": "9988776656",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Boby",
    "lname": "Mathew",
    "email": "boby.mathew@example.com",
    "mobileNo": "9123456791",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Shevin",
    "lname": "Thomas",
    "email": "shevin.thomas@example.com",
    "mobileNo": "9123456792",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Divya",
    "lname": "Rao",
    "email": "divya.rao@example.com",
    "mobileNo": "9876543212",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Jomi",
    "lname": "Francis",
    "email": "jomi.francis@example.com",
    "mobileNo": "9876543213",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Kevin",
    "lname": "Miles",
    "email": "kevin.miles@example.com",
    "mobileNo": "9988776657",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Lara",
    "lname": "Fernandez",
    "email": "lara.fernandez@example.com",
    "mobileNo": "9123456793",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Nina",
    "lname": "Khan",
    "email": "nina.khan@example.com",
    "mobileNo": "9123456794",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Oscar",
    "lname": "Lopez",
    "email": "oscar.lopez@example.com",
    "mobileNo": "9988776658",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Priya",
    "lname": "Mehta",
    "email": "priya.mehta@example.com",
    "mobileNo": "9876543214",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Quincy",
    "lname": "Nguyen",
    "email": "quincy.nguyen@example.com",
    "mobileNo": "9876543215",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Rachel",
    "lname": "Singh",
    "email": "rachel.singh@example.com",
    "mobileNo": "9123456795",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Steve",
    "lname": "Williams",
    "email": "steve.williams@example.com",
    "mobileNo": "9123456796",
    "role": "customer",
    "isBlocked": false
  },
  {
    "fname": "Tina",
    "lname": "Joseph",
    "email": "tina.joseph@example.com",
    "mobileNo": "9988776659",
    "role": "customer",
    "isBlocked": true
  },
  {
    "fname": "Umar",
    "lname": "Ali",
    "email": "umar.ali@example.com",
    "mobileNo": "9876543216",
    "role": "customer",
    "isBlocked": false
  }
]
/*********************************************************************************************************************************************************/
//temp Provider data
export let ProvidersData = [
  {
    fname: "Sophia",
    lname: "Williams",
    email: "sophia.williams@provider.com",
    mobileNo: "9812345678",
    role: "provider",
    isBlocked: false,
    isOnline: false,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    fname: "Liam",
    lname: "Johnson",
    email: "liam.johnson@provider.com",
    mobileNo: "9876543210",
    role: "provider",
    isBlocked: true,
    isOnline: false,
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
  {
    fname: "Emma",
    email: "emma@provider.com",
    role: "provider",
    isBlocked: false,
    isOnline: true,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    fname: "Noah",
    lname: "Carter",
    email: "noah.carter@provider.com",
    role: "provider",
    isBlocked: true,
    isOnline: false,
  },
  {
    fname: "Olivia",
    lname: "Clark",
    email: "olivia.clark@provider.com",
    mobileNo: "9900112233",
    role: "provider",
    isBlocked: false,
    isOnline: true,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
]

/*********************************************************************************************************************************************************/
//temp dummy data
interface Services {
  title: string;
  description: string;
  image: string;
}

export const services : Array<Services> = [
  {
    title: "Appliance Servicing",
    description:
      "Get your appliances repaired by trusted professionals. From refrigerators to washing machines, we’ve got you covered.",
    image: "/Appliance service.jpg", // Replace with your image path
  },
  {
    title: "Electrical Fixes",
    description:
      "Solve electrical issues with ease. Our certified electricians ensure safety and reliability for your home.",
    image: "/Electrical Service.jpg", // Replace with your image path
  },
  {
    title: "Plumbing Solutions",
    description:
      "From leaky faucets to major plumbing repairs, our experts provide fast and efficient solutions.",
    image: "/plumbing Service.jpg", // Replace with your image path
  },
  {
    title: "Painting Services",
    description:
      "Transform your home with professional painting services. Quality finishes guaranteed.",
    image: "/plumbing Service.jpg", // Replace with your image path
  },
  {
    title: "Appiance Servicing",
    description:
      "Get your appliances repaired by trusted professionals. From refrigerators to washing machines, we’ve got you covered.",
    image: "/Appliance service.jpg", // Replace with your image path
  },
  {
    title: "Eectrical Fixes",
    description:
      "Solve electrical issues with ease. Our certified electricians ensure safety and reliability for your home.",
    image: "/Electrical Service.jpg", // Replace with your image path
  },
  {
    title: "Pluing Solutions",
    description:
      "From leaky faucets to major plumbing repairs, our experts provide fast and efficient solutions.",
    image: "/plumbing Service.jpg", // Replace with your image path
  },
  {
    title: "Painti Services",
    description:
      "Transform your home with professional painting services. Quality finishes guaranteed.",
    image: "/plumbing Service.jpg", // Replace with your image path
    },
  
];

/*********************************************************************************************************************************************************/
export const providers: Array<string> = ['/provider1.jpg', '/provider1.jpg', '/provider1.jpg'];

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
      "Plumbing issues can escalate quickly. Here’s how to identify early warning signs and when to call in a professional.",
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
