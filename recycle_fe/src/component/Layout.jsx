
import { useState } from 'react';
import Navbar from './nav/Navbar';


const Layout = ({ children }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        //create mobile responsive layout with navbar
        <div className="">
            <Navbar isMenuOpen={isMenuOpen} setOpenMenu={setIsMenuOpen} />
            <main className="overflow-y-auto" onClick={() => setIsMenuOpen(false)}>
                {children}
            </main>
        </div>
    )
}

export default Layout;