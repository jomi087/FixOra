import { Link } from "react-router-dom"
import { blogPosts } from "../../utils/constant"

const BlogsPreview:React.FC = () => {
  return (
    <section id='blogPreview' className="container mx-auto px-5" aria-label="Latest blog posts">
        <h3 className="text-4xl font-bold font-mono underline px-4">
            Blogs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            { blogPosts.map((post) => (
                <article key={post.title} className="p-4" role="listitem" aria-label={`Blog post titled ${post.title}`}>
                    <div className="rounded-2xl cursor-pointer border ">
                        <div className="h-33 overflow-hidden p-1 rounded-t-2xl">
                            <img src={post.image} alt={post.title} className="rounded-t-2xl"/>
                        </div>
                        <h6 className="text-lg font-bold mt-2 px-2">{post.title}</h6>
                        <p className="text-sm font-semibold text-end px-2">{post.date}</p>
                        <p className="text-sm py-3 px-2">{post.description}</p>
                        <div className="flex justify-between px-4 pb-2">
                            <p className="">👤{post.author}</p>
                            <Link to='#' className="hover:text-blue-700 text-end block " aria-label={`Read more about ${post.title}`} >Read More</Link>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    </section>
  )
}

export default BlogsPreview