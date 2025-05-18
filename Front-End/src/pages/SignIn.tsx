import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

import { BGImage_404, SingIntTheme } from "../utils/constant";
import Header from "../components/common/Header";


const SignIn : React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignInForm, setIsSignInForm] = useState(true) 

  return (
    <main className="min-h-screen flex flex-col " style={{ backgroundImage: BGImage_404 }} >
      {/* Navigation */}
      <Header className={"md:text-end"} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row  pt-10 overflow-hidden ">
        
        {/* Left: Sign In Container */}
        <section className="flex flex-col justify-center items-center md:w-2/3    ">
          <div className="w-full max-w-md text-black shadow-lg shadow-black border-1 rounded-2xl p-8 pb-4 ">
            <h2 className="text-5xl text-center mb-2 font-extrabold tracking-tight">
              { isSignInForm ? "Welcome Back" : "Verify-Email" }
            </h2>
            {isSignInForm && <p className=" text-center text-black text-sm font-semibold">
              Sign in to your FixOra account to continue.
            </p>
            }

            <div aria-live="polite" className="sr-only">
              {loading && "Processing in, please wait..."}
            </div>
            
            <form className="space-y-6" noValidate>
              {/* Email */}
              <label htmlFor="email" className="block w-full">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-8">
                  <span className="bg-black px-4 py-3 font-mono text-white select-none text-sm md:text-base whitespace-nowrap">
                    E-Mail
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="flex-1 p-3 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={loading}
                    aria-required="true" 
                  />
                </div>
              </label>

              {/* Password */}
              { isSignInForm &&
                <label htmlFor="password" className="block w-full">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-blue-50">
                    <span className="bg-black px-5 py-3 text-white select-none text-sm md:text-base whitespace-nowrap">
                      Password
                    </span>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="flex-1 p-3 outline-none focus:ring-8 "
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      disabled={loading}
                      aria-required="true"
                    />
                  </div>
                </label>
              }

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-label={isSignInForm ? "Sign in to FixOra" : "verifying your email"}
                className={`w-full py-3 rounded-full font-semibold text-white shadow-lg transition-colors duration-300 cursor-pointer ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                { isSignInForm ? "Sign in" : "Verify" } 
              </button>
            </form>

            {isSignInForm &&
              <p className="mt-6 text-center">
                Don't have an account?
                <Link to="/signup" className="underline text-blue-600 font-semibold ml-1">
                  Sign up
                </Link>
              </p>
            }

            { isSignInForm &&
              <p className="text-center text-black font-medium text-sm mt-4 cursor-pointer hover:underline"
                onClick={()=>{setIsSignInForm(false)}}
              >
                  Forgot-Password
              </p> 
            }

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400 text-xs">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            { isSignInForm &&
              <Link to="#" className="flex justify-center my-4 cursor-pointer">
                <FcGoogle size={25} />
              </Link>
            }

            { !isSignInForm &&
              <Link to="/signup" className="font-semibold block text-center ">
                Create Account
              </Link>
            }

            {!isSignInForm &&
              <button className=" w-full text-center mt-6 pt-2 text-black font-semibold cursor-pointer  "
                onClick={()=>{setIsSignInForm(true)}}
              >
                Back to Login
              </button>
            }

            {isSignInForm &&
              <p className="mt-4 text-blue-100 text-center">
                <Link to="/admin" className="text-black font-semibold">
                  Explore our app
                </Link>
              </p>
            }
          </div>
        </section>

        {/* Right: Image */}
        <section className="hidden md:flex md:w-1/2 relative " >
          <img
            src={ SingIntTheme }
            alt="Sign In Illustration"
            className="object-cover w-full h-full"
          />          
        </section>
      </div>




    </main>
  );
};

export default SignIn;

