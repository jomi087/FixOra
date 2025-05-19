import { Link, useLocation } from "react-router-dom";
import { adminSideBarOptions } from "../../utils/constant";


interface SideBarProps {
  className: string; // Pass a width of the side bar
}



const SideBar: React.FC<SideBarProps> = ({ className }) => {
  const location = useLocation()

  return (
    <div className={`bg-sidebar-background text-white overflow-hidden transition-transform ${className}`}>
      <ul className="space-y-2 pt-12 text-center">
        {adminSideBarOptions.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname ===item.to 

          return (
            <li
              key={index}
              className="group relative pt-2 pb-1 mx-2 mb-6 rounded-lg hover:shadow-lg hover:shadow-black hover:scale-115 transition-transform"
            >
              <Link
                to={item.to}
                className="text-xl font-bold font-mono flex justify-center gap-2 items-center relative"
                aria-label={item.section}
              >
                <Icon
                  className={`mb-1 ${
                    index === adminSideBarOptions.length - 1 ? "text-yellow-400" : ""
                  } ${isActive ? 'text-cyan-300':''}`}
                  size={24}
                />
                {/* Visible on medium screens and above */}
                <span className={`hidden md:block ${isActive ? 'text-cyan-300':''}`}>{item.section}</span>

                {/* Hover label for small screens */}
                <span className="absolute whitespace-nowrap text-white bg-sidebar-background pt-1 pb-1 text-sm font-extralight hidden group-hover:block md:group-hover:hidden z-10">
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
