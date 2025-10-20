import { useState } from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { RoleEnum } from "@/shared/enums/roles";
import { App_Name, shortInputLength } from "@/utils/constant";

interface signInProps {
  singInThemeImage: string;
  signInSubmit: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  googleSignin: () => void;
  loading: boolean;
  role: string;
}

const SignIn: React.FC<signInProps> = ({ singInThemeImage, signInSubmit, forgotPassword, googleSignin, loading, role }) => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignInForm, setIsSignInForm] = useState(true);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignInForm) {
      forgotPassword(email);
      return;
    }
    signInSubmit(email, password);
  };

  const handleGoogleLogin = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    googleSignin();
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row  pt-10 overflow-hidden ">

      {/* Left: Sign In Container */}
      <section className="flex flex-col justify-center items-center md:w-2/3    ">
        <div className="w-full max-w-md text-black shadow-lg shadow-black border-1 rounded-2xl p-8 pb-4 ">
          <h2 className="text-5xl text-center mb-2 font-extrabold tracking-tight">
            {isSignInForm ? "Welcome Back  " : "Verify-Email"}
          </h2>
          {isSignInForm && <p className=" text-center text-black text-sm font-semibold">
            {role == "provider" ? "Lets get back to work!" : `Sign in to your ${App_Name} account to continue`}
          </p>
          }

          <div aria-live="polite" role="status" className="sr-only" >
            {loading && "Processing in, please wait..."}
          </div>

          <form className="space-y-6" noValidate onSubmit={handleFormSubmit}>
            {/* Email */}
            <label htmlFor="email" className="block w-full">
              <span className="sr-only">Email address</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-8">
                <span className="bg-black px-4 py-3 font-mono text-white select-none text-sm md:text-base whitespace-nowrap">
                  E-Mail
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  aria-required="true"
                  className="flex-1 p-3 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  value={email}
                  maxLength={shortInputLength}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </label>

            {/* Password */}
            {isSignInForm &&
              <label htmlFor="password" className="block w-full">
                <span className="sr-only">Password</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-blue-50">
                  <span className="bg-black px-5 py-3 text-white select-none text-sm md:text-base whitespace-nowrap">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    aria-required="true"
                    className="flex-1 p-3 outline-none focus:ring-8 "
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    value={password}
                    maxLength={shortInputLength}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </label>
            }

            {/* Sign In Button */}
            {isSignInForm ? (
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-label={`Sign in to ${{ App_Name }}`}
                className={`w-full py-3 rounded-full font-semibold text-white shadow-lg transition-colors duration-300 cursor-pointer ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
                }`}

              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-label={"verify-email button"}
                className={`w-full py-3 rounded-full font-semibold text-white shadow-lg transition-colors duration-300 cursor-pointer ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                Verify
              </button>
            )
            }

          </form>

          {isSignInForm &&
            <p className="mt-6 text-center">
              Don't have an account?
              <Link to="/signup" className="underline text-blue-600 font-semibold ml-1">
                Sign up
              </Link>
            </p>
          }

          {isSignInForm && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-black font-medium text-sm cursor-pointer hover:underline"
                onClick={() => setIsSignInForm(false)}
              >
                Forgot Password
              </button>
            </div>
          )}

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {isSignInForm &&
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-black font-medium text-sm cursor-pointer "
                onClick={handleGoogleLogin}
              >
                <FcGoogle size={25} />
              </button>
            </div>
          }

          {!isSignInForm &&
            <Link to="/signup" className="font-semibold block text-center ">
              Create Account
            </Link>
          }

          {!isSignInForm &&
            <button className=" w-full text-center mt-6 pt-2 text-black font-semibold cursor-pointer  "
              onClick={() => { setIsSignInForm(true); }}
            >
              Back to Login
            </button>
          }

          {isSignInForm &&
            <p className="mt-4 text-blue-100 text-center">
              <Link to={`/signIn/${RoleEnum.ADMIN}`} className="text-black font-semibold">
                Explore our app
              </Link>
            </p>
          }
        </div>
      </section>

      {/* Right: Image */}
      <section className="hidden md:flex md:w-1/2 relative " >
        <img
          src={singInThemeImage}
          alt="Sign In Illustration"
          className="object-cover w-full h-full"
        />
      </section>
    </div>
  );
};

export default SignIn;