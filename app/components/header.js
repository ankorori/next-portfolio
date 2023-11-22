import Link from 'next/link'
import Image from 'next/image'
import logoImg from "../../public/images/logo.png"

const Header = () => {
    return (
        <>
            <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-gray-800">
                <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
                <Link href="/" className='flex-none text-xl font-semibold dark:text-white'>
                    <Image src={logoImg} alt="logo" />
                </Link>
                <div class="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
                    <Link class="font-medium text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/blog" aria-current="page">blog</Link>
                    <Link class="font-medium text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/contact">contact</Link>
                </div>
                </nav>
            </header>
        </>
    )
}

export default Header