import SideBar from "../../components/common/Others/SideBar"
import Nav from "../../components/common/layout/Nav"
import { userSideBarOptions } from "../../utils/constant"
import Profile from "@/components/client/Profile"
import EditProfile from "@/components/client/EditProfile"
import { useState } from "react"


const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-8" />
        {editMode ?
          <EditProfile setEditMode={setEditMode} />
          :
          <Profile setEditMode={setEditMode} />
        }
      </main>
    </>
  )
}

export default ProfilePage