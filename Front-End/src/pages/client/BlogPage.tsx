import Blogs from "@/components/client/blogs/Blogs";
import Nav from "@/components/common/layout/Nav";

const BlogPage = () => {
  return (
    <div className="h-screen " >
      <Nav className='bg-nav-background text-nav-text' />
      <main className="pt-18 min-h-screen text-nav-text bg-nav-background ">
        <Blogs/>
      </main>
    </div>
  );
};

export default BlogPage;