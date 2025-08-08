import { useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../Others/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { App_Name, Messages, navItems } from "../../../utils/constant";
import { useLocation } from 'react-router-dom'
import AuthService from "../../../services/AuthService"; 
import { logout } from "../../../store/user/userSlice";
import { toast } from "react-toastify";
import { RoleEnum } from "@/shared/enums/roles";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";


interface NavProps {
  className: string; // Pass a bg-color and  text-coler  
}

const Nav: React.FC<NavProps> = ({ className = ""}) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signInOption, setSignInOption] = useState(false); 
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark'); //doubt what will do in next js
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleSignout = async () => {
    try {
      const res =await AuthService.signoutApi()
      if (res.status === HttpStatusCode.OK) {
        dispatch(logout())

        toast.success(res.data.message)

        setTimeout(() => {
            navigate("/");
        },100);
      }
    } catch (error:any) {
      const errorMsg = error?.response?.data?.message || Messages.LOGIN_FAILED;
      toast.error(errorMsg);
    }
  }

  return (
    <>
      <nav className={`shadow-lg fixed w-full z-10 ${className}`}>
        <div className="flex items-center justify-between px-7 py-4 ">
          {/* Logo */}
          <div className="hidden md:flex text-3xl font-bold tracking-wide cursor-default" aria-label={`${App_Name} Logo`}>
            {App_Name}
          </div>
          <div className="flex md:hidden text-3xl font-bold tracking-wide" aria-label={`${App_Name} Logo`}>
            Fix<ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} version={"mobile"} />ra
          </div>
          
          {/* Navigation Links */}
          { isAuthenticated && user?.role === RoleEnum.CUSTOMER  && (
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
            {isAuthenticated && user?.role === RoleEnum.CUSTOMER && (
              <>
                <button className="md:hidden "
                  onClick={ () => {
                    setIsMenuOpen(!isMenuOpen);
                    if( signInOption ) setSignInOption(false);
                  }}
                  aria-expanded={isMenuOpen} aria-label="Toggle navigation menu" aria-controls="mobile-menu"
                >
                  { isMenuOpen ? (<X size={24}/>):(<Menu size={24}/>)}
                </button>
                { isMenuOpen && (
                  <div className="md:hidden rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu">
                    {navItems
                    .filter((item)=> item.to != location.pathname )
                    .map((item) => (
                      <Link 
                        key={item.to}
                        to = {item.to}
                        className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"
                      >
                        {item.name}
                      </Link>
                  ))}
                  </div>
                )}
              </>
            )}

            {/* Login/Logout Button */}
            <div className=""> 
              {!isAuthenticated ? (
                <button
                  className="flex items-center gap-2  font-bold hover:text-header-hover transition cursor-pointer"
                  onMouseEnter={ () => {
                    setSignInOption(true);
                    if (isMenuOpen)  setIsMenuOpen(false);
                  }}
                >
                  <LogIn size={18} aria-hidden="true" /> 
                  <span className="hidden md:flex">In</span>
                </button>
              ) : (
                <button
                  className="flex items-center gap-2  font-bold hover:text-header-hover transition cursor-pointer"
                  onClick={handleSignout}
                >
                  <LogOut size={18} aria-hidden="true" /> 
                  <span className="hidden md:flex">Out</span>
                </button>
              )}

              { !isAuthenticated && signInOption && (
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