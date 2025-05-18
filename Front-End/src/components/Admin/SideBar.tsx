import { MdDashboard, MdBarChart } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { FcServices } from "react-icons/fc";
import { AiFillAlert } from "react-icons/ai";
import { Link } from "react-router-dom";

interface SideBarOption {
  icon: React.ElementType;
  section: string;
  to?: string;
}

const sideBarOptions: SideBarOption[] = [
  { icon: MdDashboard, section: "Dashboard", to: "/dashboard" },
  { icon: FaUsers, section: "Users", to: "/users" },
  { icon: FaUsersGear, section: "Providers", to: "/providers" },
  { icon: MdBarChart, section: "Sales", to: "/sales" },
  { icon: FcServices, section: "Services", to: "/services" },
  { icon: AiFillAlert, section: "Dispute", to: "/dispute" },
];

const SideBar: React.FC = () => {
  return (
    <div className="h-screen bg-gray-800 text-white overflow-hidden transition-transform w-22 md:w-64 relative">
      <ul className="space-y-2 pt-12 text-center">
        {sideBarOptions.map((item, index) => {
          const Icon = item.icon;

          return (
            <li
              key={index}
              className="group relative pt-2 pb-1 mx-2 mb-4 rounded-md border-b border-purple-900 hover:border-violet-400 shadow-2xl hover:shadow-purple-400 hover:scale-110 transition-transform"
            >
              <Link
                to={item.to || "#"}
                className="text-xl font-bold font-mono flex justify-center gap-2 items-center relative"
                aria-label={item.section}
              >
                <Icon
                  className={`mb-1 ${
                    index === sideBarOptions.length - 1 ? "text-yellow-400" : ""
                  }`}
                  size={24}
                />
                {/* Visible on medium screens and above */}
                <span className="hidden md:block">{item.section}</span>

                {/* Hover label for small screens */}
                <span className="absolute whitespace-nowrap text-white bg-gray-800 pt-1 pb-1 text-sm font-extralight hidden group-hover:block md:group-hover:hidden z-10">
                  {item.section}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
