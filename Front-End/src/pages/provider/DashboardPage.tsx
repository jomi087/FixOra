import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import BookingInfo from "@/components/provider/dashboard/BookingInfo";
import { providerSideBarOptions } from "@/utils/constant";

const DashboardPage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-8" />
        <BookingInfo/>
      </div>
    </>
  );
};

export default DashboardPage;