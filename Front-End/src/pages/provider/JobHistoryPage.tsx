import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/others/SideBar";
import JobHistoryTable from "@/components/provider/history/JobHistoryTable";
import { providerSideBarOptions } from "@/utils/constant";

const JobHistoryPage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-8" />
        <JobHistoryTable/>
      </main>
    </>
  );
};

export default JobHistoryPage;
