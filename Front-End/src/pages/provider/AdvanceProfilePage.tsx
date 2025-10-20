import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/others/SideBar";
import { providerSideBarOptions } from "@/utils/constant";
import AdvanceProfile from "@/components/provider/settings/account/AdvanceProfile";

const AdvanceProfilePage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-8" />
        <AdvanceProfile/>
      </div>
    </>
  );
};

export default AdvanceProfilePage;