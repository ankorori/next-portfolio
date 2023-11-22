import Link from 'next/link'
import Image from 'next/image'
import fs from "fs"       
import path from "path" 
import matter from "gray-matter"

async function getAllBlogs() {  
    const files = fs.readdirSync(path.join("data"))
    const blogs = files.map((fileName) => {
        const slug = fileName.replace(".md", "")
        const fileData = fs.readFileSync(
            path.join("data", fileName),
            "utf-8"
        )
        const { data } = matter(fileData) 
        return {
            frontmatter: data,
            slug: slug, 
        }
    })

    const orderedBlogs = blogs.sort((a, b) => {
        return b.frontmatter.id - a.frontmatter.id
    })

    return{
        blogs: orderedBlogs
    }
}

const Blog = async() => {
    const { blogs } = await getAllBlogs() 
    return (
        <>
            <div className="container mx-auto px-8">
                <h1>Blog</h1>
                <p>エンジニアの日常生活をお届けします</p>
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                    <div className="grid lg:grid-cols-2 lg:gap-y-16 gap-10">
                        { blogs.map((blog, index) => 
                            <Link className="group rounded-xl overflow-hidden dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href={`/blog/${blog.slug}`}>
                                <div className="sm:flex">
                                    <div className="flex-shrink-0 relative rounded-xl overflow-hidden w-full sm:w-56 h-44">
                                        <Image className="group-hover:scale-105 transition-transform duration-500 ease-in-out w-full h-full absolute top-0 start-0 object-cover rounded-xl" src={blog.frontmatter.image} alt="Image Description" width={1000} height={300} quality={90} priority={true} />
                                    </div>
                                    <div className="grow mt-4 sm:mt-0 sm:ms-6 px-4 sm:px-0">
                                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white">
                                            {blog.frontmatter.title}
                                        </h3>
                                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                                            {blog.frontmatter.excerpt}
                                        </p>
                                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                                            {blog.frontmatter.date}
                                        </p>
                                        <p className="mt-4 inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline font-medium">
                                            Read more
                                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Blog