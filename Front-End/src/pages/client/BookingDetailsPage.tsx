import BookingDetails from "@/components/client/accountSection/bookingsSection/BookingDetails";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import { userSideBarOptions } from "@/utils/constant";

const BookingDetailsPage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-8" />
        <BookingDetails />
      </div>
    </>
  );
};

export default BookingDetailsPage;