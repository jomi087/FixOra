export const BGImage_404:string = "url('/404_Bg_Image.jpg')"  //used in sign-in, sign-up, pagenot-found,
export const HeroSectionImage:string = "/Hero-removebg-preview.png"
export const SingInThemeImage:string  = "/signIn.png"

export const constraints = [
    { label: "At least 10 characters", test: (pw: string) => pw.length > 10 },
    { label: "At least one capital letter", test: (pw: string) => /[A-Z]/.test(pw) },
    { label: "At least one number", test: (pw: string) => /\d/.test(pw) },
    { label: "At least one symbol", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

export const signupApi =`${import.meta.env.VITE_API_URL}/api/auth/signup`













/********************************************* Side-Bar Sections *******************************************************/
interface SideBarOption {
  icon: React.ElementType;
  section: string;
  to: string;
}

//Admins Side Bar
import { MdDashboard, MdBarChart } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";
import { AiFillAlert } from "react-icons/ai";

export const adminSideBarOptions: SideBarOption[] = [
  { icon: MdDashboard, section: "Dashboard", to: "/dashboard" },
  { icon: FaUsers, section: "Users", to: "/users" },
  { icon: FaUsersGear, section: "Providers", to: "/providers" },
  { icon: MdBarChart, section: "Sales", to: "/sales" },
  { icon: FcServices, section: "Services", to: "/services" },
  { icon: AiFillAlert, section: "Dispute", to: "/dispute" },
];

//Provider Side Bar



/********************************************************************************************************************************************************* */
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
