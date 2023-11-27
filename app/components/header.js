import Link from 'next/link'
import Image from 'next/image'
import logoImg from "../../public/images/logo.png"

const Header = () => {
    return (
        <>
            <header className="flex flex-wrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
                <nav className="max-w-[85rem] w-full mx-auto px-4" aria-label="Global">
                    <Link href="/" className='flex-none text-xl font-semibold dark:text-white'>
                        <Image src={logoImg} alt="logo" height={100} width={100} quality={90} priority={true} />
                    </Link>
                    <div className="flex flex-row items-center gap-5 mt-5">
                        <Link className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/" aria-current="page">blog</Link>
                        <Link className="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/contact">contact</Link>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header