import { KYCStatus } from "@/shared/enums/kycStatus";
import type { Category } from "@/shared/Types/category";
import type { CustromersData, ProviderData } from "@/shared/Types/user";
import {
  Home, Briefcase, Users, FileText, User,
  CalendarCheck, MessageSquareText, Wallet, ShieldAlert,
  LayoutDashboard, Settings, BarChartBig, Wrench, AlertTriangle,
} from "lucide-react";

/********************************************* Image Sections *******************************************************/
export const BGImage_404: string = "url('/404_Bg_Image.jpg')"  //used in sign-in, sign-up, pagenot-found,
export const HeroSectionImage:string = "/Hero-removebg-preview.png"
export const SingInThemeImage: string = "/signIn.png"
/********************************************* rules  *******************************************************/
export const categoryImageSize: number = 1  //default set  to 2 mb
export const providerImageSize : number = 1

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

/**********************************************************************************************************************************************************/
/*********************************************************************************************************************************************************/
//temp Provider data
// export let ProvidersData: ProviderData[] = [
//   {
//     fname: "Sophia",
//     lname: "Williams",
//     email: "sophia.williams@provider.com",
//     mobileNo: "9812345678",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/sophia/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/sophia/education.pdf",
//         experience: "https://example.com/kyc/sophia/experience.pdf"
//       }
//     },
//     serviceCharge: 1200,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "Apt 302, Green Heights",
//       street: "MG Road",
//       district: "South Delhi",
//       city: "Delhi",
//       locality: "Greater Kailash",
//       state: "Delhi",
//       postalCode: "110048",
//       coordinates: {
//         latitude: 28.5385,
//         longitude: 77.2416
//       }
//     }
//   },
//   {
//     fname: "Liam",
//     lname: "Johnson",
//     email: "liam.johnson@provider.com",
//     mobileNo: "9876543210",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/men/47.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/liam/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/liam/education.pdf"
//       }
//     },
//     serviceCharge: 1500,
//     kycInfo: {
//       status: KYCStatus.Rejected,
//       reason: "ID document expired"
//     },
//     location: {
//       street: "Brigade Road",
//       district: "Bangalore Urban",
//       city: "Bangalore",
//       locality: "Ashok Nagar",
//       state: "Karnataka",
//       postalCode: "560025",
//       coordinates: {
//         latitude: 12.9716,
//         longitude: 77.5946
//       }
//     }
//   },
//   {
//     fname: "Emma",
//     lname: "Brown",
//     email: "emma@provider.com",
//     mobileNo: "8765432109",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/women/50.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/emma/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/emma/education.pdf",
//         experience: "https://example.com/kyc/emma/experience.pdf"
//       }
//     },
//     serviceCharge: 1800,
//     kycInfo: {
//       status: KYCStatus.Pending
//     },
//     location: {
//       houseinfo: "No. 45",
//       street: "Marine Drive",
//       district: "Mumbai City",
//       city: "Mumbai",
//       locality: "Churchgate",
//       state: "Maharashtra",
//       postalCode: "400020",
//       coordinates: {
//         latitude: 18.9353,
//         longitude: 72.8261
//       }
//     }
//   },
//   {
//     fname: "Noah",
//     lname: "Carter",
//     email: "noah.carter@provider.com",
//     mobileNo: "7654321098",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/men/32.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/noah/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/noah/education.pdf"
//       }
//     },
//     serviceCharge: 2000,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       street: "Park Street",
//       district: "Kolkata",
//       city: "Kolkata",
//       locality: "Esplanade",
//       state: "West Bengal",
//       postalCode: "700016",
//       coordinates: {
//         latitude: 22.5726,
//         longitude: 88.3639
//       }
//     }
//   },
//   {
//     fname: "Olivia",
//     lname: "Clark",
//     email: "olivia.clark@provider.com",
//     mobileNo: "9900112233",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/women/65.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/olivia/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/olivia/education.pdf",
//         experience: "https://example.com/kyc/olivia/experience.pdf"
//       }
//     },
//     serviceCharge: 1600,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "Villa 12",
//       street: "Jubilee Hills",
//       district: "Hyderabad",
//       city: "Hyderabad",
//       locality: "Road No. 36",
//       state: "Telangana",
//       postalCode: "500033",
//       coordinates: {
//         latitude: 17.4339,
//         longitude: 78.3906
//       }
//     }
//   },
//   {
//     fname: "Aarav",
//     lname: "Patel",
//     email: "aarav.patel@provider.com",
//     mobileNo: "8899223344",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/men/22.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/aarav/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/aarav/education.pdf"
//       }
//     },
//     serviceCharge: 1400,
//     kycInfo: {
//       status: KYCStatus.Pending
//     },
//     location: {
//       street: "CG Road",
//       district: "Ahmedabad",
//       city: "Ahmedabad",
//       locality: "Navrangpura",
//       state: "Gujarat",
//       postalCode: "380009",
//       coordinates: {
//         latitude: 23.0225,
//         longitude: 72.5714
//       }
//     }
//   },
//   {
//     fname: "Ishaan",
//     lname: "Sharma",
//     email: "ishaan.sharma@provider.com",
//     mobileNo: "7788990011",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/men/41.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/ishaan/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/ishaan/education.pdf",
//         experience: "https://example.com/kyc/ishaan/experience.pdf"
//       }
//     },
//     serviceCharge: 1900,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "Flat 5B",
//       street: "Baner Road",
//       district: "Pune",
//       city: "Pune",
//       locality: "Aundh",
//       state: "Maharashtra",
//       postalCode: "411045",
//       coordinates: {
//         latitude: 18.5626,
//         longitude: 73.8087
//       }
//     }
//   },
//   {
//     fname: "Ananya",
//     lname: "Gupta",
//     email: "ananya.gupta@provider.com",
//     mobileNo: "6677889900",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/33.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/ananya/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/ananya/education.pdf"
//       }
//     },
//     serviceCharge: 1700,
//     kycInfo: {
//       status: KYCStatus.Rejected,
//       reason: "Incomplete documents"
//     },
//     location: {
//       street: "Tonk Road",
//       district: "Jaipur",
//       city: "Jaipur",
//       locality: "Sitapura",
//       state: "Rajasthan",
//       postalCode: "302022",
//       coordinates: {
//         latitude: 26.8500,
//         longitude: 75.8000
//       }
//     }
//   },
//   {
//     fname: "Vihaan",
//     lname: "Singh",
//     email: "vihaan.singh@provider.com",
//     mobileNo: "5566778899",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/men/55.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/vihaan/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/vihaan/education.pdf",
//         experience: "https://example.com/kyc/vihaan/experience.pdf"
//       }
//     },
//     serviceCharge: 2100,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "No. 12",
//       street: "Lodhi Road",
//       district: "Central Delhi",
//       city: "Delhi",
//       locality: "Lodhi Colony",
//       state: "Delhi",
//       postalCode: "110003",
//       coordinates: {
//         latitude: 28.5900,
//         longitude: 77.2200
//       }
//     }
//   },
//   {
//     fname: "Aditi",
//     lname: "Joshi",
//     email: "aditi.joshi@provider.com",
//     mobileNo: "4455667788",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/28.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/aditi/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/aditi/education.pdf"
//       }
//     },
//     serviceCharge: 1300,
//     kycInfo: {
//       status: KYCStatus.Pending
//     },
//     location: {
//       street: "FC Road",
//       district: "Pune",
//       city: "Pune",
//       locality: "Deccan Gymkhana",
//       state: "Maharashtra",
//       postalCode: "411004",
//       coordinates: {
//         latitude: 18.5158,
//         longitude: 73.8402
//       }
//     }
//   },
//   {
//     fname: "Reyansh",
//     lname: "Malhotra",
//     email: "reyansh.malhotra@provider.com",
//     mobileNo: "3344556677",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/men/60.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/reyansh/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/reyansh/education.pdf",
//         experience: "https://example.com/kyc/reyansh/experience.pdf"
//       }
//     },
//     serviceCharge: 2200,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "Flat 8C",
//       street: "Ballygunge Circular Road",
//       district: "Kolkata",
//       city: "Kolkata",
//       locality: "Ballygunge",
//       state: "West Bengal",
//       postalCode: "700019",
//       coordinates: {
//         latitude: 22.5300,
//         longitude: 88.3500
//       }
//     }
//   },
//   {
//     fname: "Saanvi",
//     lname: "Reddy",
//     email: "saanvi.reddy@provider.com",
//     mobileNo: "2233445566",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/39.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/saanvi/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/saanvi/education.pdf"
//       }
//     },
//     serviceCharge: 1500,
//     kycInfo: {
//       status: KYCStatus.Rejected,
//       reason: "Certificate not verified"
//     },
//     location: {
//       street: "Hitech City Road",
//       district: "Hyderabad",
//       city: "Hyderabad",
//       locality: "Madhapur",
//       state: "Telangana",
//       postalCode: "500081",
//       coordinates: {
//         latitude: 17.4474,
//         longitude: 78.3762
//       }
//     }
//   },
//   {
//     fname: "Arjun",
//     lname: "Kapoor",
//     email: "arjun.kapoor@provider.com",
//     mobileNo: "1122334455",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/men/25.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/arjun/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/arjun/education.pdf",
//         experience: "https://example.com/kyc/arjun/experience.pdf"
//       }
//     },
//     serviceCharge: 2400,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "No. 7",
//       street: "Linking Road",
//       district: "Mumbai Suburban",
//       city: "Mumbai",
//       locality: "Bandra West",
//       state: "Maharashtra",
//       postalCode: "400050",
//       coordinates: {
//         latitude: 19.0550,
//         longitude: 72.8300
//       }
//     }
//   },
//   {
//     fname: "Diya",
//     lname: "Mehta",
//     email: "diya.mehta@provider.com",
//     mobileNo: "9988776655",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/women/47.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/diya/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/diya/education.pdf"
//       }
//     },
//     serviceCharge: 1350,
//     kycInfo: {
//       status: KYCStatus.Pending
//     },
//     location: {
//       street: "Residency Road",
//       district: "Bangalore Urban",
//       city: "Bangalore",
//       locality: "Richmond Town",
//       state: "Karnataka",
//       postalCode: "560025",
//       coordinates: {
//         latitude: 12.9700,
//         longitude: 77.6000
//       }
//     }
//   },
//   {
//     fname: "Kabir",
//     lname: "Choudhary",
//     email: "kabir.choudhary@provider.com",
//     mobileNo: "8877665544",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/men/30.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/kabir/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/kabir/education.pdf",
//         experience: "https://example.com/kyc/kabir/experience.pdf"
//       }
//     },
//     serviceCharge: 2300,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "B-204",
//       street: "Sector 18 Road",
//       district: "Noida",
//       city: "Noida",
//       locality: "Sector 18",
//       state: "Uttar Pradesh",
//       postalCode: "201301",
//       coordinates: {
//         latitude: 28.5700,
//         longitude: 77.3200
//       }
//     }
//   },
//   {
//     fname: "Myra",
//     lname: "Saxena",
//     email: "myra.saxena@provider.com",
//     mobileNo: "7766554433",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/52.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/myra/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/myra/education.pdf"
//       }
//     },
//     serviceCharge: 1650,
//     kycInfo: {
//       status: KYCStatus.Rejected,
//       reason: "ID photo unclear"
//     },
//     location: {
//       street: "Anna Salai",
//       district: "Chennai",
//       city: "Chennai",
//       locality: "Teynampet",
//       state: "Tamil Nadu",
//       postalCode: "600018",
//       coordinates: {
//         latitude: 13.0400,
//         longitude: 80.2400
//       }
//     }
//   },
//   {
//     fname: "Ayaan",
//     lname: "Khan",
//     email: "ayaan.khan@provider.com",
//     mobileNo: "6655443322",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/men/45.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/ayaan/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/ayaan/education.pdf",
//         experience: "https://example.com/kyc/ayaan/experience.pdf"
//       }
//     },
//     serviceCharge: 2500,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "No. 23",
//       street: "Jawaharlal Nehru Road",
//       district: "Chennai",
//       city: "Chennai",
//       locality: "Adyar",
//       state: "Tamil Nadu",
//       postalCode: "600020",
//       coordinates: {
//         latitude: 13.0100,
//         longitude: 80.2500
//       }
//     }
//   },
//   {
//     fname: "Avni",
//     lname: "Desai",
//     email: "avni.desai@provider.com",
//     mobileNo: "5544332211",
//     role: "provider",
//     isBlocked: false,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/60.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/avni/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/avni/education.pdf"
//       }
//     },
//     serviceCharge: 1450,
//     kycInfo: {
//       status: KYCStatus.Pending
//     },
//     location: {
//       street: "Law Garden Road",
//       district: "Ahmedabad",
//       city: "Ahmedabad",
//       locality: "Ellisbridge",
//       state: "Gujarat",
//       postalCode: "380006",
//       coordinates: {
//         latitude: 23.0300,
//         longitude: 72.5700
//       }
//     }
//   },
//   {
//     fname: "Rudra",
//     lname: "Agarwal",
//     email: "rudra.agarwal@provider.com",
//     mobileNo: "4433221100",
//     role: "provider",
//     isBlocked: false,
//     isOnline: true,
//     image: "https://randomuser.me/api/portraits/men/50.jpg",
//     gender: "Male",
//     kyc: {
//       idCard: "https://example.com/kyc/rudra/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/rudra/education.pdf",
//         experience: "https://example.com/kyc/rudra/experience.pdf"
//       }
//     },
//     serviceCharge: 2600,
//     kycInfo: {
//       status: KYCStatus.Approved
//     },
//     location: {
//       houseinfo: "Flat 12D",
//       street: "Salt Lake Sector V",
//       district: "Kolkata",
//       city: "Kolkata",
//       locality: "Bidhannagar",
//       state: "West Bengal",
//       postalCode: "700091",
//       coordinates: {
//         latitude: 22.5800,
//         longitude: 88.4300
//       }
//     }
//   },
//   {
//     fname: "Kiara",
//     lname: "Nair",
//     email: "kiara.nair@provider.com",
//     mobileNo: "3322110099",
//     role: "provider",
//     isBlocked: true,
//     isOnline: false,
//     image: "https://randomuser.me/api/portraits/women/70.jpg",
//     gender: "Female",
//     kyc: {
//       idCard: "https://example.com/kyc/kiara/id.jpg",
//       certificate: {
//         education: "https://example.com/kyc/kiara/education.pdf"
//       }
//     },
//     serviceCharge: 1750,
//     kycInfo: {
//       status: KYCStatus.Rejected,
//       reason: "Experience certificate missing"
//     },
//     location: {
//       street: "MG Road",
//       district: "Gurgaon",
//       city: "Gurgaon",
//       locality: "Sector 29",
//       state: "Haryana",
//       postalCode: "122002",
//       coordinates: {
//         latitude: 28.4700,
//         longitude: 77.0300
//       }
//     }
//   }
// ];

/*********************************************************************************************************************************************************/
//temp category dummy data ui
interface Services {
  title: string;
  description: string;
  image: string;
}
//temp category dummy data ui
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
