import fs from "fs"       
import path from "path" 
import matter from "gray-matter"

export const blogsPerPage = 6

export async function getAllBlogs() {
    const files = fs.readdirSync(path.join("data"))
    const blogs = files.map((fileName) => {
        const slug = fileName.replace(".md", "").replace(/[0-9]{1,3}./, "");
        const fileData = fs.readFileSync(
            path.join("data", fileName),
            "utf-8"
        );
        const { data } = matter(fileData);
        return {
            frontmatter: data,
            slug: slug,
            fileName: fileName,
        }
    })
    const orderedBlogs = blogs.sort((a, b) => {
        return b.frontmatter.id - a.frontmatter.id
    })
    const tags = [];
    blogs.map((blog) => {
        for (const tag of blog.frontmatter.tags) {
            tags.push(tag);
        }
        return tags;
    });
    const numberPages = Math.ceil(orderedBlogs.length / blogsPerPage)
    return{
        blogs: orderedBlogs,
        numberPages: numberPages,
        tags: [...new Set(tags)],
    }
}

export async function getSingleBlog(context, blogs) {
    const { slug } = context.params
    const blog = blogs.find((v) => v.slug === slug);
    const data = await import(`../../data/${blog.fileName}`)
    const singleDocument = matter(data.default)

    return {
        singleDocument: singleDocument
    }
}

export async function getTgasFilterBlog(context, blogs) {
    const { tag } = context.params
    const filterBlogs = blogs.filter((v) => v.frontmatter.tags.includes(tag));

    return {
        blogs: filterBlogs
    }
}