import { useState } from "react";
import { Home, Briefcase, Users, FileText, LogIn, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { Link } from "react-router-dom";


interface NavProps {
  className: string; // Pass a bg-color and  text-coler
  isLoggedIn?: boolean; 
  role?: string; 

}

const Nav: React.FC<NavProps> = ({ className = "", isLoggedIn = false, role = "client" }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode , setDarkMode] = useState<boolean>(()=> localStorage.getItem('theme') === 'dark' ); //doubt what will do in next js

  return (
    <>
      <nav className={`shadow-lg fixed w-full z-10 ${className}`}>
        <div className="flex items-center justify-between px-7 py-4 ">
          {/* Logo */}
          <div className="hidden md:flex text-3xl font-bold tracking-wide cursor-default" aria-label="FixOra Logo">
            FixOra
          </div>
          <div className="flex md:hidden text-3xl font-bold tracking-wide" aria-label="FixOra Logo">
            Fix<ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} version={"mobile"} />ra
          </div>


          {/* Hamburger Menu for Mobile */}
          <button className="md:hidden " onClick={() => { setIsMenuOpen(!isMenuOpen) }}
            aria-expanded={isMenuOpen} aria-label="Toggle navigation menu" aria-controls="mobile-menu"
          >
            { isMenuOpen ? (<X size={24}/>):(<Menu size={24}/>)}
          </button>
         
        {isMenuOpen && (
            <div className="md:hidden rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu">
              <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Home </Link>
              <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Services </Link>
              <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Providers </Link>
              <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Blog </Link>
              <div className="mt-1 border-t-2 pt-4">
                {!isLoggedIn ? (
                  <Link to="#" role="menuitem" className="flex items-center gap-2  font-bold hover:text-header-hover transition" >
                    <LogIn size={18} aria-hidden="true"  /> Login
                  </Link>
                ) : (
                  <Link to="#" role="menuitem" className="flex items-center gap-2  font-bold hover:text-header-hover transition" >
                    <LogOut size={18} aria-hidden="true"  /> Logout
                  </Link>
                )}
              </div>
          </div>
        )}
          
          {/* Navigation Links */}
          {role === "client" && isLoggedIn && (
            <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link to="#" className="flex items-center gap-2  hover:font-bold transition">
                <Home size={18} aria-hidden="true" /> Home
              </Link>

              <Link to="#" className="flex items-center gap-2  hover:font-bold transition" >
                <Briefcase size={18} aria-hidden="true" /> Services
              </Link>

              <Link to="#" className="flex items-center gap-2  hover:font-bold transition" >
                <Users size={18} aria-hidden="true" /> Providers
              </Link>

              <Link to="#" className="flex items-center gap-2  hover:font-bold transition" >
                <FileText size={18} aria-hidden="true" /> Blog
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-6  ">
            {/* Theme Toggle */}
            <ThemeToggle  darkMode={darkMode} setDarkMode={setDarkMode} version={"desktop"}  />

            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <Link to="/signIn" className="flex items-center gap-2  font-bold hover:text-header-hover transition" >
                <LogIn size={18}  aria-hidden="true"/> Sign-In
              </Link>
            ) : (
              <Link to="#" className="flex items-center gap-2  font-bold hover:text-header-hover transition" >
                <LogOut size={18} aria-hidden="true" /> Sign-Out
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;