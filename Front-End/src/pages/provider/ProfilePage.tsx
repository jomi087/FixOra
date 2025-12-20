import Profile from "@/components/common/profile/Profile";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/other/SideBar";
import { providerSideBarOptions } from "@/utils/constant";

const ProfilePage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-3" />
        <Profile/>
      </div>
    </>
  );
};

export default ProfilePage;