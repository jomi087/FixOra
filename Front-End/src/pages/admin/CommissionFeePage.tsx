import CommissionFee from "@/components/admins/settings/CommissionFee";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/other/SideBar";
import { adminSideBarOptions } from "@/utils/constant";

const CommissionFeePage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-3 " />
        <CommissionFee/>
      </div>
    </>
  );
};

export default CommissionFeePage;