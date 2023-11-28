import Link from 'next/link'
import Image from 'next/image'
import fs from "fs"       
import path from "path" 
import matter from "gray-matter"
import Pagination from "./components/pagination"
import { getAllBlogs, blogsPerPage } from "./utils/mdQueries"

export default async() => {
    const { blogs, numberPages } = await getAllBlogs()
    const limitedBlogs = blogs.slice(0, blogsPerPage)
    return (
        <>
            <div className="container mx-auto px-8">
                <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <h1>インフラ〜バックエンドあたりの技術についてメモしています</h1>
                    <div className="grid lg:grid-cols-2 lg:gap-y-16 gap-10 mt-10">
                        { limitedBlogs.map((blog, index) =>
                            <div key={index} className='shadow-2xl transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-600'>
                            <Link className="group rounded-xl overflow-hidden dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href={`/blog/${blog.slug}`}>
                                <div className="sm:flex">
                                    <div className="flex-shrink-0 relative rounded-xl overflow-hidden w-full sm:w-56 h-44">
                                        <Image className="w-auto h-auto absolute top-0 start-0 object-cover rounded-xl" src={blog.frontmatter.image} alt="Image Description" width={300} height={100} quality={90} priority={true} />
                                    </div>
                                    <div className="grow mt-4 sm:mt-0 sm:ms-6 px-4 sm:px-0">
                                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-white">
                                            {blog.frontmatter.title}
                                        </h3>
                                        <p className="mt-3 text-gray-600 dark:text-gray-400">
                                            {blog.frontmatter.date}
                                        </p>
                                        <p className="mt-4 inline-flex items-center gap-x-1 text-blue-600 decoration-2 hover:underline font-medium">
                                            Read more
                                            <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            </div>
                        )}
                    </div>
                    <Pagination numberPages={numberPages} />
                </div>
            </div>
        </>
    )
}
