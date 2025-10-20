import SideBar from "../../components/common/others/SideBar";
import Nav from "../../components/common/layout/Nav";
import { userSideBarOptions } from "@/utils/constant";
import BookingHistoryTable from "@/components/client/accountSection/bookingsSection/history/BookingHistoryTable";


const BookingHistoryPage: React.FC = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-8" />
        <BookingHistoryTable />
      </main>
    </>
  );
};

export default BookingHistoryPage;