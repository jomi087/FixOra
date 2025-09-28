import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import ScheduleAvailability from "@/components/provider/settings/availability/ScheduleAvailability";
import { providerSideBarOptions } from "@/utils/constant";

const AvailabilityPage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-8" />
        <ScheduleAvailability/>
      </div>
    </>
  );
};

export default AvailabilityPage;