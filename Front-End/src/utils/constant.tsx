export const BGImage_404 = "url('/404_Bg_Image.jpg')"
export const HeroSectionImage = "/Hero-removebg-preview.png"



//temp
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
