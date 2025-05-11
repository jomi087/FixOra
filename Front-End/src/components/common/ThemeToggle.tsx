import { Moon, Sun } from "lucide-react";
import { useEffect, } from "react";
import { GiMoon, GiStripedSun} from "react-icons/gi";

interface ThemeProps {
  darkMode?: boolean;
  setDarkMode: (value: boolean) => void;
  version: "desktop" | "mobile";
}


const ThemeToggle: React.FC<ThemeProps> = ({darkMode=false,setDarkMode,version}) => {

  // const [darkMode , setDarkMode] = useState<boolean>(()=> localStorage.getItem('theme') === 'dark' );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark'); 
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex items-center gap-2">
      {version === "desktop" ? (
        <>
          <Sun size={18} className={`transition ${darkMode ? 'text-gray-400' : 'text-yellow-400'}`} />
          <button onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${darkMode ? 'bg-gray-600' : 'bg-yellow-400'
              }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300  ${darkMode ? 'translate-x-7' : ''
                }`}
            ></div>
          </button>
          <Moon size={18} className={`transition ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
        </>
      ) : (
        <button onClick={() => setDarkMode(!darkMode)}
          className={`w-7 h-7 mt-2 rounded-full shadow-md transform duration-300 `}
          >
          <div>
            {darkMode ? (
              <GiMoon size={28} className="text-gray-400" />
              ) : (
              <GiStripedSun size={28} className='text-yellow-400' /> 
            )}   
          </div>
        </button>
        )
      }
    </div> 
  );
};

export default ThemeToggle;


