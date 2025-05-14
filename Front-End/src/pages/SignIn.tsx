import { Link } from "react-router-dom";

import { useState } from "react";
import { BGImage_404 } from "../utils/constant";

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: BGImage_404 }}>
      {/* Navigation */}
      <nav className=" flex items-center px-7 py-4 ">
        <h1 className="fixed text-3xl font-extrabold tracking-tight text-blue-700 select-none ">
          FixOra
        </h1>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row ">
        {/* Left: Sign In Container */}
        <section className="flex flex-col justify-center items-center md:w-2/3 pt-18 ">
          <div className="w-full max-w-md text-black drop-shadow-lg">
            <h2 className="text-5xl text-center mb-2 font-extrabold tracking-tight">
              Welcome Back
            </h2>
            <p className="mb-8 text-center text-black-700 text-sm font-semibold">
              Sign in to your FixOra account to continue.
            </p>

            <form className="space-y-8 " noValidate >
              <label htmlFor="email" className="block w-full shadow-2xl shadow-black">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <span className="bg-black px-4 py-3 font-mono text-white select-none text-sm md:text-base">
                    E-Mail
                  </span>
                  <input
                    type="email"
                    className="flex-1 outline-none focus:ring-2 focus:ring-offset-1"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </label>

              <label htmlFor="password" className="block w-full shadow-2xl shadow-black">
                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm bg-blue-50">
                  <span className="bg-black px-5 py-3 text-white select-none text-sm md:text-base">
                    Password
                  </span>
                  <input
                    type="text"
                    className="flex-1 p-3 outline-none focus:ring-2 focus:ring-offset-1"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full font-semibold text-white shadow-2xl shadow-black transition-colors duration-300 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-blue-600 font-semibold">
                Sign up
              </Link>
            </p>

            <p className="mt-4 text-blue-100 text-center">
              <Link to="/admin" className="text-black font-semibold">
                Explore our app
              </Link>
            </p>
          </div>
        </section>

        {/* Right: Image */}
        <section className="hidden md:flex md:w-1/2 relative " >
          <img
            src="/signIn.png"
            alt="Sign In Illustration"
            className="object-cover w-full h-full"
          />          
        </section>
      </div>

    </div>
  );
};

export default SignIn;


          // import Spline from '@splinetool/react-spline'
          //  <Spline scene="https://prod.spline.design/hNfClYEFxdGOsdZG/scene.splinecode" />
