import ThemeToggle from "./ThemeToggle";

const Nav = () => {
  const isLoggedIn = false; //Replace with actual authentication logic
  const Role = "client"; //Replace with actual user role logic
  return (
    <div>
      <nav>
        <div>
          <div className="flex items-center justify-between px-7 py-4 bg-[#373F84]">  {/* bg must be passed as a  argument */}
            <div className="text-white text-2xl font-bold ">Fix-Ora</div>
            { Role == "client" && (
              <div className="hidden md:flex space-x-15">
                <a href="#" className="text-gray-300 hover:text-white">Home</a>
                <a href="#" className="text-gray-300 hover:text-white">Services</a>
                <a href="#" className="text-gray-300 hover:text-white">Providers</a>
                <a href="#" className="text-gray-300 hover:text-white">Blog</a>
              </div>
            )}
            <div>
              <ThemeToggle/>
              {!isLoggedIn ? (
                  <a href="#" className="text-gray-300 hover:text-white px-2 py-2 font-bold">
                    Login
                  </a>
                ) : (
                  <a href="#" className="text-gray-300 hover:text-white px-2 py-2 font-bold">
                    Logout
                  </a>
                )
              }
   

            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav