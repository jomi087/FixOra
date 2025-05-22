import Spline from "@splinetool/react-spline"
import { useState } from "react";
import { Link } from "react-router-dom"
import type { user } from "../../../Types/user";

interface signUpProps{
  alternativeSideContent?: string; //only image acceptable
  loading?: boolean;
  signUpSubmit: (formData:user) => Promise<void>;
} 


const SignUp: React.FC<signUpProps> = ({ loading, alternativeSideContent, signUpSubmit }) => {

    const [formData, setFormData] = useState<user>({
      fname: "",
      lname: "",
      email: "",
      mobile: "",
      password: "",
      cPassword: ""
    });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    /* Basic js verison
    const name = e.target.name;
    const value = e.target.value;

    const newFormData = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      cPassword: formData.cPassword,
    };

    newFormData[name] = value;
    setFormData(newFormData);

    */
    
    //Advance js version 
    const { name, value } = e.target
    setFormData({...formData ,[name]:value})
  }

  const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault()
    signUpSubmit(formData)
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row  pt-10 overflow-hidden ">
      {/* Left: Image */}
      <section className="hidden md:flex md:w-1/2  relative top-45  p-4 ">
        { alternativeSideContent ? (
          <img src={ alternativeSideContent } alt="" />
          ) : (
            <div className="w-full h-[400px] max-h-[80vh] rounded-2xl overflow-hidden">
              <Spline scene="https://prod.spline.design/hNfClYEFxdGOsdZG/scene.splinecode" />
            </div>
          )
        }
      </section>

      {/* Right: Sign Up Container */}
      <section className="flex flex-col justify-center items-center md:w-2/3    ">
        <div className="w-full max-w-md text-black shadow-lg shadow-black border-1 rounded-2xl p-4 ">
          <h2 className="text-4xl text-center mb-10 font-extrabold tracking-tight">
            Create Your Account
          </h2>

          <div aria-live="polite" className="sr-only">
            {loading && "Signing up , please wait..."}
          </div>
          
          <form className="space-y-4" noValidate onSubmit={handleFormSubmit}>
            <div className="flex justify-between items-center rounded-lg overflow-hidden">
              {/* First Name */}
              <label htmlFor="fname" className="sr-only">
                First Name
              </label>
              <input
                id="fname"
                name="fname"
                type="text"
                placeholder="Enter your first name"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mr-1.5 "
                required
                disabled={loading}
                aria-required="true"
                aria-disabled={loading}
                value={formData.fname}
                onChange={handleChange}
              />
              {/*Last Name*/}
              <label htmlFor="lname" className="sr-only">
                Last Name
              </label>
              <input
                id="lname"
                name="lname"
                type="text"
                placeholder="Enter your Last name"
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 ml-1.5"
                required
                disabled={loading}
                aria-required="true"
                aria-disabled={loading}
                value={formData.lname}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mr-1.5 "
              required
              disabled={loading}
              autoComplete="email"
              aria-required="true"
              aria-disabled={loading}
              value={formData.email}
              onChange={handleChange}
            />

            {/* Mobile Number */}
            <label htmlFor="mobile" className="sr-only">
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              placeholder="Enter your Mobile number"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mr-1.5 "
              required
              disabled={loading}
              aria-required="true"
              aria-disabled={loading}
              value={formData.mobile}
              onChange={handleChange}
            />

            {/* Password */}
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="text"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mr-1.5 "
              required
              disabled={loading}
              aria-required="true"
              aria-disabled={loading}
              value={formData.password}
              onChange={handleChange}
            />

            {/* C-Password */}
            <label htmlFor="cPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="cPassword"
              name="cPassword"
              type="text"
              placeholder="Confirm password"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 mr-1.5 "
              required
              disabled={loading}
              aria-required="true"
              aria-disabled={loading}
              value={formData.cPassword}
              onChange={handleChange}
            />

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              aria-label="Sign up to FixOra"
              className={`w-full py-3 rounded-full font-semibold text-white shadow-lg transition-colors duration-300 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center">
            Already have an account?
            <Link to="/signin" className="underline text-blue-600 font-semibold ml-1">
              Sign-In
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default SignUp