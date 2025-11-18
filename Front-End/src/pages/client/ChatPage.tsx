import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/others/SideBar";
import { userSideBarOptions } from "@/utils/constant";
import Chat from "@/components/common/others/chatSection/Chat";

const ChatPage = () => {
  return (
    <div className="h-screen " >
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-3" />
        <Chat/>
      </main>
    </div>
  );
};

export default ChatPage;