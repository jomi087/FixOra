import SideBar from "@/components/common/others/SideBar";
import Nav from "../../components/common/layout/Nav";
import { adminSideBarOptions } from "@/utils/constant";
import DisputeSection from "@/components/admin/dispute/DisputeSection";

const DisputePage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-3" />
        <DisputeSection/>
      </div>
    </>
  );
};

export default DisputePage;
