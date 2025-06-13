import { useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { Link } from "react-router-dom";
import { RoleEnum } from "../../../../shared/enums/roles";
import { useAppSelector } from "../../../store/hooks";
import { navItems } from "../../../utils/constant";
import { useLocation } from 'react-router-dom'


interface NavProps {
  className: string; // Pass a bg-color and  text-coler  
}

const Nav: React.FC<NavProps> = ({ className = ""}) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signInOption, setSignInOption] = useState(false); 
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark'); //doubt what will do in next js
  const location = useLocation()


  const user = useAppSelector((state) => state.auth.user);

  const handleHamburgerClick = () => {
    setIsMenuOpen(!isMenuOpen);
    if( signInOption ){
      setSignInOption(false);
    }
  };

  


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
          
          {/* Navigation Links */}
          { user && user?.role === RoleEnum.CUSTOMER  && (
            <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems
                .filter((item)=> item.to != location.pathname )
                .map((item) => (
                  <Link 
                    key={item.to}
                    to = {item.to}
                    className="flex items-center gap-2  hover:font-bold transition"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
              ))}
            </div>
          )}

          
          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-5  ">

            {/* Theme Toggle */}
            <div className="hidden md:flex">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} version={"desktop"} />
            </div>

            {/* Hamburger Menu for Mobile */}
            <button className="md:hidden " onClick={handleHamburgerClick}
              aria-expanded={isMenuOpen} aria-label="Toggle navigation menu" aria-controls="mobile-menu"
            >
              { isMenuOpen ? (<X size={24}/>):(<Menu size={24}/>)}
            </button>
            { isMenuOpen && (
                <div className="md:hidden rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu">
                  <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Home </Link>
                  <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Services </Link>
                  <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Providers </Link>
                  <Link to="#" role="menuitem" className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> Blog </Link>
              </div>
            )}

            {/* Login/Logout Button */}
            <div className=""> 
              {!user ? (
                <h4 className="flex items-center gap-2  font-bold hover:text-header-hover transition cursor-pointer"
                  // onClick={() => { setSignInOption(!signInOption) }}
                  onMouseEnter={() => { setSignInOption(true); if(isMenuOpen){setIsMenuOpen(false);} } }
                >
                  <LogIn size={18} aria-hidden="true" /> 
                  <span className="hidden md:flex">In</span>
                </h4>
              ) : (
                <Link to="#" className="flex items-center gap-2  font-bold hover:text-header-hover transition" >
                    <LogOut size={18} aria-hidden="true" />
                    <span className="hidden md:flex">Out</span>
                </Link>
              )}

              { !user && signInOption && (
                <div className="rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu"
                  onMouseLeave={ () => { setSignInOption(false) }}
                >
                  <Link to={`/signIn/${RoleEnum.CUSTOMER}`}  className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> as User </Link>
                  <Link to={`/signIn/${RoleEnum.PROVIDER}`}  className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> as Provider </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;