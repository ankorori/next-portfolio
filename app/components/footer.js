async function getCopylite() {
    const Year = new Date().getFullYear() 
    if (2023 == Year) {
      return <p>©2023 TKC Blog. All Rights Reserved. </p>
    } else {
      return <p>©2023-{ Year } TKC Blog. All Rights Reserved. </p>
    }
}

const Footer = async() => {
    const copylite = await getCopylite();
    return (
        <>
        <footer className="bg-blue-200 p-4">
            <div className="p-2 w-full pt-8 mt-8 border-gray-200 text-center">
          <span className="inline-flex">
            <a className="text-gray-500" href='https://github.com/ankorori/'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z">
                </path>
              </svg>
            </a>
            <a className="ml-4 text-gray-500" href='https://twitter.com/tkc13687936/'>
              <svg xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
          </span>
          <br></br>
              { copylite }
        </div>
        </footer>
        </>
    )
}

export default Footer