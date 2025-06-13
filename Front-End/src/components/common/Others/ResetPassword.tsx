import { useState } from "react";
import { BiShow, BiHide, BiCheckCircle, BiXCircle } from "react-icons/bi";
import { constraints } from "../../../utils/constant";



const ResetPassword = () => {
    
    const [showPw, setShowPw] = useState(false);
    const [showCPw, setShowCPw] = useState(false);
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    
    const allValid = constraints.every(c => c.test(password)) && password === cPassword && password.length > 0;

  return (
    <div className="rounded-xl shadow-lg p-11 pt-5 shadow-black ">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-800">Reset Password</h2>
        <p className="text-gray-600 text-center mb-4 text-sm">
            Enter a strong password to secure your account.
        </p>
        <form>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
                <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    id="password"
                    className="flex-1 p-2.5 outline-none text-base "
                    placeholder="New password"
                    required
                    aria-required="true"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="px-2 text-gray-500 hover:text-blue-700"
                    tabIndex={-1}
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                >
                    {showPw ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
            </div>
    
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <input
                    type={showCPw ? "text" : "password"}
                    name="cPassword"
                    id="cPassword"
                    className="flex-1 p-2.5 outline-none text-base "
                    placeholder="Confirm password"
                    required
                    aria-required="true"
                    value={cPassword}
                    onChange={e => setCPassword(e.target.value)}
                />
                <button
                    type="button"
                    className="px-2 text-gray-500 hover:text-blue-700"
                    tabIndex={-1}
                    onClick={() => setShowCPw(v => !v)}
                    aria-label={showCPw ? "Hide password" : "Show password"}
                >
                    {showCPw ? <BiHide size={20} /> : <BiShow size={20} />}
                </button>
            </div>

            <div className="mb-4 mt-3">
                <ul className="space-y-1">
                    {constraints.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            {c.test(password) ? (
                                <BiCheckCircle className="text-green-600" />
                            ) : (
                                <BiXCircle className="text-gray-400" />
                            )}
                            <span className={c.test(password) ? "text-green-700" : "text-gray-500"}>
                                {c.label}
                            </span>
                        </li>
                    ))}
                    <li className="flex items-center gap-2 text-sm">
                        {password && cPassword && password === cPassword ? (
                            <BiCheckCircle className="text-green-600" />
                        ) : (
                            <BiXCircle className="text-gray-400" />
                        )}
                        <span className={password && cPassword && password === cPassword ? "text-green-700" : "text-gray-500"}>
                            Passwords match
                        </span>
                    </li>
                </ul>
            </div>

            <button
                type="submit"
                className={`w-full py-2.5 rounded-md font-bold text-base transition-colors duration-200 ${
                    allValid
                        ? "bg-blue-700 text-white hover:bg-blue-800"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!allValid}
            >
                Reset Password
            </button>
        </form>
    </div>
  )
}

export default ResetPassword