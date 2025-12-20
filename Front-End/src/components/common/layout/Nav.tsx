import { useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../other/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { App_Name, Messages, navItems } from "../../../utils/constant";
import { useLocation } from "react-router-dom";
import AuthService from "../../../services/AuthService";
import { logout } from "../../../store/common/userSlice";
import { toast } from "react-toastify";
import { RoleEnum } from "@/shared/enums/roles";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { NotificationType } from "@/shared/enums/NotificationType";
import type { Notification } from "@/shared/types/booking";
import { splitDateTime } from "@/utils/helper/Date&Time";
import { clearNotifications, fetchNotifications, markAsRead } from "@/store/common/notificationSlice";
import type { AxiosError } from "axios";
import { generateToken } from "@/services/pushNotificationConfig";


interface NavProps {
  className: string; // Pass a bg-color and  text-coler  
}


const Nav: React.FC<NavProps> = ({ className = "" }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signInOption, setSignInOption] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("theme") === "dark"); //doubt what will do in next js
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.notification);

  const unreadCount = items.filter((itm) => {
    return itm.isRead === false;
  }).length;

  const handleSignout = async () => {
    try {
      let fcmToken: string | null = null;

      if (user?.role === RoleEnum.PROVIDER) {
        fcmToken = localStorage.getItem("fcm_token") || (await generateToken());
      }
      const res = await AuthService.signoutApi(fcmToken);

      if (res.status === HttpStatusCode.OK) {
        if (user?.role == RoleEnum.PROVIDER) {
          localStorage.removeItem("fcm_token");
        }
        dispatch(clearNotifications());
        dispatch(logout());

        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.LOGIN_FAILED;
      toast.error(errorMsg);
    }
  };

  const handleNotificationInDetails = async (noti: Notification) => {
    if (!user) return;
    const { bookingId } = noti.metadata || {};
    if (!noti.notificationId) return;

    if (!noti.isRead && noti.notificationId) {
      try {
        await AuthService.acknowledgeNotificationAPI(noti.notificationId);
        dispatch(markAsRead(noti.notificationId));
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        const errorMsg =
          err.response?.data?.message || "Notification acknowledgment failed";
        toast.info(errorMsg);
        return; // stop navigation if ack failed
      }
    }

    switch (noti.type) {
    case NotificationType.BOOKING_CONFIRMED:
    case NotificationType.BOOKING_CANCELLED:
    case NotificationType.BOOKING_COMPLETED:
      if ([RoleEnum.CUSTOMER, RoleEnum.PROVIDER].includes(user.role) && bookingId) {
        navigate(`/${user.role}/booking-details/${bookingId}`);
      }
      break;
    case NotificationType.KYC_REQUEST:
      navigate(`/${user.role}/provider-request`);
      break;

    default:
      toast.warn(`Unhandled notification type: ${noti.type}`);
    }
  };

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
          {isAuthenticated && user?.role === RoleEnum.CUSTOMER && (
            <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navItems
                .filter((item) => item.to != location.pathname)
                .map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-2  hover:font-bold transition"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
            </div>
          )}
          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4  ">
            {isAuthenticated && user &&
              <div
                className="cursor-pointer transform transition-transform duration-200 hover:scale-110"
                onClick={() => {
                  const nextState = !isNotificationOpen;
                  setIsNotificationOpen(nextState);
                  if (nextState && unreadCount > 0) {
                    dispatch(fetchNotifications());
                  }
                }}
              >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 &&
                  <span
                    className="font-semibold text-sm"
                    aria-label="Unread notification"
                  >
                    ({unreadCount})
                  </span>
                }
              </div>
            }
            {isNotificationOpen && (
              <div
                className=" rounded-xl shadow-xl absolute top-16 right-10 bg-primary-foreground/95 text-primary p-2 border-2 "
                aria-label="Notifications"
              >
                <h4 className="text-xl font-semibold underline underline-offset-4 m-2">
                  Notification
                </h4>
                <div className="overflow-y-scroll max-h-96 w-64 md:w-80 overflow-x-hidden thin-scrollbar">
                  {items.length > 0 ? (
                    <>
                      {items.map((noti) => {
                        const { date, time } = splitDateTime(noti.createdAt);
                        return (
                          <div
                            key={noti.notificationId}
                            className="group border-b-4 p-4 cursor-pointer hover:scale-105"
                            onClick={() => handleNotificationInDetails(noti)}
                          >
                            <p className="text-xs font-semibold text-end">
                              {`${date} ${time}`}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold font-mono text-sm group-hover:underline">
                                  {noti.title}
                                </p>
                                {!noti.isRead && (
                                  <span className="border-2 bg-green-400 h-2 w-2 rounded-full inline-block" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs">{noti.message}</p>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500 italic">
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <div className="hidden md:flex">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} version={"desktop"} />
            </div>

            {/* Hamburger Menu for Mobile */}
            {isAuthenticated && user?.role === RoleEnum.CUSTOMER && (
              <>
                <button className="md:hidden "
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    if (signInOption) setSignInOption(false);
                  }}
                  aria-expanded={isMenuOpen} aria-label="Toggle navigation menu" aria-controls="mobile-menu"
                >
                  {isMenuOpen ? (<X size={24} />) : (<Menu size={24} />)}
                </button>
                {isMenuOpen && (
                  <div className="md:hidden rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu">
                    {navItems
                      .filter((item) => item.to != location.pathname)
                      .map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
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
                  onMouseEnter={() => {
                    setSignInOption(true);
                    if (isMenuOpen) setIsMenuOpen(false);
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
              {!isAuthenticated && signInOption && (
                <div className="rounded-lg shadow-lg absolute top-12 right-2 p-4" aria-label="Mobile menu"
                  onMouseLeave={() => { setSignInOption(false); }}
                >
                  <Link to={`/signIn/${RoleEnum.CUSTOMER}`} className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> as User </Link>
                  <Link to={`/signIn/${RoleEnum.PROVIDER}`} className="block py-2 px-4 rounded-lg hover:bg-white hover:text-blue-500 transition font-medium"> as Provider </Link>
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