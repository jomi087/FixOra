import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import type { SideBarOption } from "../../../utils/constant";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface SideBarProps {
  SideBar: Array<SideBarOption>;
  className?: string;

}

const SideBar: React.FC<SideBarProps> = ({ SideBar, className }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showSideBar, setShowSideBar] = useState(true);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <div className={` ${showSideBar ? "translate-x-0" : "hidden"} overflow-hidden  min-w-1/7 lg:min-w-1/6 lg:max-w-1/6 shrink-0 ${className}`}>
        <ChevronsLeft
          size={20}
          className="ml-auto font-extralight text-primary/70 cursor-pointer mr-1"
          onClick={() => setShowSideBar(false)}
        />
        <ul className="space-y-2 mt-8">
          {SideBar.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <li
                key={index}
                className="group relative flex justify-center md:justify-start mx-1 sm:mx-5 pt-2 pb-1 mb-6 rounded-lg  transition-transform"
              >
                {item.children ? (
                  <div className="">
                    <button
                      onClick={() => {
                        toggleSection(item.section);
                      }}
                      className="text-xl font-bold font-mono flex gap-2  relative w-full"
                    >
                      <Icon className="mb-1" size={24} />
                      <span className="hidden md:block">{item.section}</span>
                    </button>

                    {openSection === item.section && (
                      <div className="mt-4 space-y-4  sm:ml-2 border-l-1 ">
                        {item.children.map((child, i) => {
                          const ChildIcon = child.icon;
                          const isChildActive = location.pathname === child.to;
                          return (
                            <div key={i}>
                              <Link
                                to={child.to!}
                                className={`text-base hover:scale-110 font-mono flex px-2 gap-2 relative ${isChildActive ? "text-cyan-300" : ""
                                }`}
                              >
                                <ChildIcon size={20} />
                                <span className="hidden md:block ">{child.section}</span>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.to!}
                    className={`text-xl font-bold font-mono flex gap-2 relative ${isActive ? "text-cyan-300" : ""
                    }`}
                    aria-label={item.section}
                  >
                    <Icon className="mb-1" size={24} />
                    <span className={`hidden md:block ${isActive ? "text-cyan-300" : ""}`}>
                      {item.section}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {!showSideBar && (
        <div className={`!border-0 ${className}`}>
          <ChevronsRight
            size={20}
            className="font-extralight text-primary/70 cursor-pointer ml-1"
            onClick={() => setShowSideBar(true)}
          />
        </div>
      )}

    </>
  );
};

export default SideBar;
