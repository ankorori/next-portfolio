import Link from 'next/link'

const PrevNext =(props) => {
    return (
        <div className="mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200">
            { 0 < props.prev.length &&
                <Link className='group flex items-center hover:text-slate-900 dark:hover:text-white' href={`/blog/${props.prev[0].slug}`}>
                    <img src="/images/arrow-left.svg" alt="arrow-left"/>
                    {props.prev[0].frontmatter.title}
                </Link>
            }
            { 0 < props.next.length &&
                <Link className='group ml-auto flex items-center hover:text-slate-900 dark:hover:text-white' href={`/blog/${props.next[0].slug}`}>
                    {props.next[0].frontmatter.title}
                    <img src="/images/arrow-right.svg" alt="arrow-right"/>
                </Link>
            }
        </div>
    )
}

export default PrevNext