import { Link, useLocation } from "react-router-dom";
import type { SideBarOption } from "../../../utils/constant";


interface SideBarProps {
    SideBar: Array<SideBarOption>;
    className?: string; // Optional className prop for additional styling
}


const SideBar: React.FC<SideBarProps> = ({ SideBar, className }) => {
  const location = useLocation();

  return (
    <div className={`overflow-hidden transition-transform min-w-1/5 shrink-0 ${className}`}>
      <ul className="space-y-2 pt-12 text-center">
        {SideBar.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname ===item.to; 

          return (
            <li
              key={index}
              className="group relative pt-2 pb-1 mx-2 mb-6 rounded-lg  hover:scale-120 transition-transform"
            >
              <Link
                to={item.to}
                className="text-xl font-bold font-mono flex justify-center gap-2 items-center relative"
                aria-label={item.section}
              >
                <Icon className={"mb-1"} size={24} />
                {/* Visible on medium screens and above */}
                <span className={`hidden md:block ${isActive ? "text-cyan-300":""}`}>{item.section}</span>

                {/* Hover label for small screens */}
                <span className="absolute whitespace-nowrap top-4 pt-1 pb-1 text-sm font-extralight hidden group-hover:block md:group-hover:hidden z-10">
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
