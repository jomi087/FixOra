import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/others/SideBar";
import { adminSideBarOptions, settingOptions } from "@/utils/constant";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-3 " />
        <div className="w-full text-base md:text-lg font-mono mt-10 cursor-pointer">
          {settingOptions.map(({ section, to }) => (
            <div
              className="border p-4  mx-3  rounded-sm  active:scale-99 hover:border-primary hover:shadow-md shadow-primary/20 "
              onClick={() => navigate(to)}
            >
              {section}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;