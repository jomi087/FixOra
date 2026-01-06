import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/other/SideBar";
import ProviderBlogManagment from "@/components/provider/blogs/ProviderBlogManagment";
import { providerSideBarOptions } from "@/utils/constant";

const BlogPage = () => {
  return (
    <div className="h-screen " >
      <Nav className='bg-nav-background text-nav-text' />
      <main className="flex pt-16 h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={providerSideBarOptions} className="border-r-1 my-3" />
        <ProviderBlogManagment/>
      </main>
    </div>
  );
};

export default BlogPage;