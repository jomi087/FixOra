import { blogPosts } from "../../utils/constant"

const BlogsPreview = () => {
  return (
      <section id='blogPreview' className="container mx-auto px-5">
            <h3 className="text-4xl font-bold font-mono underline pt-20 px-4">
                Blogs
            </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {blogPosts.map((post) => (
                <div key={post.title} className="p-4">
                    <div className="rounded-2xl cursor-pointer border ">
                        <div className="h-33 overflow-hidden p-1 rounded-t-2xl">
                            <img src={post.image} alt={post.title} className="rounded-t-2xl"/>
                        </div>
                        <h6 className="text-lg font-bold mt-2 px-2">{post.title}</h6>
                        <p className="text-sm font-semibold text-end px-2">{post.date}</p>
                        <p className="text-sm py-3 px-2">{post.description}</p>
                        <div className="flex justify-between px-4 pb-2">
                            <p className="">👤{post.author}</p>
                            <a className="hover:text-blue-700 text-end block ">Read More</a>
                        </div>
                    </div>
                </div>
            ))}
        </div> 
    </section>
  )
}

export default BlogsPreview