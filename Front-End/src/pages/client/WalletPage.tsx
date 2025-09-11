import Wallet from "@/components/client/accountSection/walletSection/Wallet";
import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/Others/SideBar";
import { userSideBarOptions } from "@/utils/constant";

const WalletPage = () => {
  return (
    <>
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={userSideBarOptions} className="border-r-1 my-8" />
        <Wallet/>
      </main>
    </>
  );
};

export default WalletPage;