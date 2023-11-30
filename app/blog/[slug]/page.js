import Image from 'next/image'
import ReactMarkdown from "react-markdown"
import codeBlock from "../../components/codeBlock"
import PrevNext from '@/app/components/prevNext'
import { getAllBlogs, getSingleBlog } from "../../utils/mdQueries"

const SingleBlog = async(props) => {
    const { blogs } = await getAllBlogs()
    const { singleDocument } = await getSingleBlog(props, blogs)
    const prev = blogs.filter(blog => blog.frontmatter.id === singleDocument.data.id - 1)
    const next = blogs.filter(blog => blog.frontmatter.id === singleDocument.data.id + 1)
    return (
        <>
            <div className="wrapper">
                <div className="container mx-auto px-8">
            <div className="container my-5">
                <Image src={singleDocument.data.image} alt="blog-image" height={500} width={500} quality={90} priority={true} />
            </div>
                    <div className="markdown">
                        <div className='mb-5 p-5 border-b border-slate-500'>
                            <h1>{singleDocument.data.title}</h1>
                            <p>{singleDocument.data.date}</p>
                            { singleDocument.data.tags.map((tag, index) =>
                                <span className='border-2 rounded-md mr-1 p-1 border-sky-500 bg-sky-500' key={index}>{tag}</span>
                            )}
                        </div>
                        <ReactMarkdown
                            children={singleDocument.content}
                            components={{ code: codeBlock }}
                        />
                    </div>
                    <PrevNext prev={prev} next={next} />
                </div>
            </div>
        </>
    )
}

export default SingleBlog

export async function generateStaticParams() {
    const { blogs } = await getAllBlogs()
    const paths = blogs.map((blog) => `/${blog.slug}`)
    return paths
}