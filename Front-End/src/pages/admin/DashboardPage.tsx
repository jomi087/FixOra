import SideBar from "@/components/common/others/SideBar";
import Nav from "../../components/common/layout/Nav";
import { adminSideBarOptions } from "@/utils/constant";
import DashBoard from "@/components/admin/DashBoard";

const DashboardPage:React.FC = () => {
  return (
    <>
      {/* <Nav className='bg-nav-background text-nav-text' />
        <div className="flex pt-16 min-h-screen">
            <SideBar />
            <DashBoard />
        </div> */}
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8 bg-sid" />
        <DashBoard />
      </div>
    </>
  );
};

export default DashboardPage;