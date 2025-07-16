import { Link } from 'react-router-dom'

interface HeaderProps {
    className : string   // Pass a bg-color and  text-coler
}


const Header:React.FC<HeaderProps> = ({className}) => {
    return (
        <header className={`text-center px-5 pt-4 w-full md:fixed ${className}`}>
            <Link to="/" className=" text-4xl font-extrabold tracking-tight text-blue-700 select-none"  aria-label="FixOra Home" >
                FixOra
            </Link>
        </header>
    )
}

export default Header