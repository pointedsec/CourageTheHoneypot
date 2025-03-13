import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


export default function LoggedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar/>
            <div className="flex flex-col min-h-screen bg-base-100 text-white">
                {children}
            </div>
            <Footer/>
        </>
    )
}