import SideBar from "@/components/common/other/SideBar";
import Nav from "../../components/common/layout/Nav";
import { adminSideBarOptions } from "@/utils/constant";
import Dashboard from "@/components/admin/dashboard/Dashboard";

const DashboardPage:React.FC = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-3" />
        <Dashboard />
      </div>
    </>
  );
};

export default DashboardPage;