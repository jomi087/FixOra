import EditProfile from "@/components/client/accountSection/profileSection/EditProfile";
import SideBar from "../../components/common/Others/SideBar";
import Nav from "../../components/common/layout/Nav";
import { userSideBarOptions } from "../../utils/constant";
import { useState } from "react";
import Profile from "@/components/common/Others/Profile";


const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-8" />
        {editMode  ?
          <EditProfile toggle={setEditMode} />
          :
          <Profile toggle={setEditMode} />
        }
      </main>
    </>
  );
};

export default ProfilePage;