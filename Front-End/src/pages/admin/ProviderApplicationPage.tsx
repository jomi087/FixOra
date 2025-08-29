import ProviderApplicationList from "@/components/admin/providerManagment/ProviderApplicationList";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import { adminSideBarOptions } from "@/utils/constant";


const ProviderApplicationPage = () => {

  return (
    <>
      <Nav className="bg-nav-background text-nav-text" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 " />
        <ProviderApplicationList/>
      </div>
    </>
  );
};

export default ProviderApplicationPage;