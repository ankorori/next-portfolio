import "./styles/all.css"
import Header from "./components/header"
import Footer from "./components/footer"

const RootLayout = ({ children }) => {
    return (
        <html lang="jp">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}

export default RootLayout