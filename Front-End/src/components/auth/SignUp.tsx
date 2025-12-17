import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import type { Signup } from "@/shared/types/user";
import { RoleEnum } from "@/shared/enums/roles";
import { shortInputLength } from "@/utils/constant";

// Lazy load Spline
const Spline = lazy(() => import("@splinetool/react-spline"));

interface signUpProps {
  alternativeSideContent?: string;
  loading?: boolean;
  signUpSubmit: (formData: Signup) => Promise<void>;
}

const SignUp: React.FC<signUpProps> = ({ loading, alternativeSideContent, signUpSubmit }) => {

  const [pageReady, setPageReady] = useState(false);

  const [formData, setFormData] = useState<Signup>({
    fname: "",
    lname: "",
    email: "",
    mobileNo: "",
    password: "",
    cPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    /* Basic js verison
    const name = e.target.name;
    const value = e.target.value;

    const newFormData = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      mobileNo: formData.mobileNo,
      password: formData.password,
      cPassword: formData.cPassword,
    };
    newFormData[name] = value;
    setFormData(newFormData);
    */
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    signUpSubmit(formData);
  };

  return (
    <>
      {/* FULL PAGE LOADER */}
      {!pageReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">
              Preparing signup experience…
            </p>
          </div>
        </div>
      )}

      {/* PAGE CONTENT (renders only when ready) */}
      <div
        className={`flex flex-1 flex-col md:flex-row pt-10 overflow-hidden transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* LEFT SIDE */}
        <section className="hidden md:flex md:w-1/2 p-4 relative top-48 ">
          {alternativeSideContent ? (
            <img
              src={alternativeSideContent}
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-[400px] max-h-[80vh] rounded-2xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    Loading 3D…
                  </div>
                }
              >
                <Spline
                  scene="https://prod.spline.design/hNfClYEFxdGOsdZG/scene.splinecode"
                  onLoad={() => setPageReady(true)}
                />
              </Suspense>
            </div>
          )}
        </section>

        {/* RIGHT SIDE */}
        <section className="flex flex-col justify-center items-center md:w-2/3">
          <div className="w-full max-w-md text-black shadow-lg shadow-black rounded-2xl p-4">
            <h2 className="text-4xl text-center mb-10 font-extrabold tracking-tight">
              Create Your Account
            </h2>

            <form className="space-y-4" onSubmit={handleFormSubmit} noValidate>
              {/* Name */}
              <div className="flex gap-2">
                <input
                  name="fname"
                  placeholder="First name"
                  className="w-full p-3 border rounded-lg"
                  value={formData.fname}
                  onChange={handleChange}
                  maxLength={shortInputLength}
                  required
                />
                <input
                  name="lname"
                  placeholder="Last name"
                  className="w-full p-3 border rounded-lg"
                  value={formData.lname}
                  onChange={handleChange}
                  maxLength={shortInputLength}
                  required
                />
              </div>

              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {/* Mobile */}
              <input
                name="mobileNo"
                placeholder="Mobile number"
                className="w-full p-3 border rounded-lg"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />

              {/* Password */}
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {/* Confirm */}
              <input
                name="cPassword"
                type="password"
                placeholder="Confirm password"
                className="w-full p-3 border rounded-lg"
                value={formData.cPassword}
                onChange={handleChange}
                required
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full font-semibold text-white ${loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
                }`}
              >
                {loading ? "Signing Up…" : "Sign Up"}
              </button>
            </form>

            <p className="mt-6 text-center">
              Already have an account?
              <Link
                to={`/signIn/${RoleEnum.CUSTOMER}`}
                className="underline text-blue-600 font-semibold ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SignUp;
