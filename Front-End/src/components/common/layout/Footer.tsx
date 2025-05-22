import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FooterProps {
  className: string; // Pass a bg-color and  text-coler
}

const Footer: React.FC<FooterProps> = ({ className ="" }) => {
  return (
    <footer className={`text-center py-10 ${className}`}>
      {/* Footer Links */}
      <div className="flex flex-col md:flex-row justify-evenly gap-4 mb-6">
        <Link to="#" className="hover:underline">
          Terms and Conditions
        </Link>
        <Link to="#" className="hover:underline">
          Privacy Policy
        </Link>
        <Link to="#" className="hover:underline">
          About Us
        </Link>
        <Link to="#" className="hover:underline">
          Contact Us
        </Link>
        <Link to="#" className="hover:underline">
          Careers
        </Link>
        <Link to="#" className="hover:underline">
          Help Center
        </Link>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-6 mb-6">
        <Link to="#" aria-label="Facebook" className="hover:text-blue-500">
          <FaFacebookF size={20} />
        </Link>
        <Link to="#" aria-label="Twitter" className="hover:text-blue-400">
          <FaTwitter size={20} />
        </Link>
        <Link to="#" aria-label="Instagram" className="hover:text-pink-500">
          <FaInstagram size={20} />
        </Link>
        <Link to="#" aria-label="LinkedIn" className="hover:text-blue-700">
          <FaLinkedinIn size={20} />
        </Link>
        <Link to="#" aria-label="YouTube" className="hover:text-red-500">
          <FaYoutube size={20} />
        </Link>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <p className="text-sm">
          Email: <Link to="mailto:support@fixora.com" className="hover:underline">support@fixora.com</Link>
        </p>
        <p className="text-sm">
          Phone: <Link to="tel:+1234567890" className="hover:underline">+91 (000) 000-000</Link>
        </p>
      </div>

      {/* Copyright */}
      <p className="text-sm">
        © 2025 FixOra. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;