import Link from 'next/link'

const Pagination = (props) => {
    return (
        <div className="p-2 w-full pt-8 mt-8 border-gray-200 text-center">
            {Array.from({ length: props.numberPages }, (_, i) => (
                <Link className="ml-5" key={i + 1} href={ i === 0 ? `/` : `/blog/page/${i + 1}`}>
                {i + 1}
                </Link>
            ))}
        </div>
    )
}

export default Pagination