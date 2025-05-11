import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

interface FooterProps {
  props: string; // CSS class string
}

const Footer: React.FC<FooterProps> = ({ props }) => {
  return (
    <footer className={`text-center py-10 ${props}`}>
      {/* Footer Links */}
      <div className="flex flex-col md:flex-row justify-evenly gap-4 mb-6">
        <a href="#" className="hover:underline">
          Terms and Conditions
        </a>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          About Us
        </a>
        <a href="#" className="hover:underline">
          Contact Us
        </a>
        <a href="#" className="hover:underline">
          Careers
        </a>
        <a href="#" className="hover:underline">
          Help Center
        </a>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-6 mb-6">
        <a href="#" aria-label="Facebook" className="hover:text-blue-500">
          <FaFacebookF size={20} />
        </a>
        <a href="#" aria-label="Twitter" className="hover:text-blue-400">
          <FaTwitter size={20} />
        </a>
        <a href="#" aria-label="Instagram" className="hover:text-pink-500">
          <FaInstagram size={20} />
        </a>
        <a href="#" aria-label="LinkedIn" className="hover:text-blue-700">
          <FaLinkedinIn size={20} />
        </a>
        <a href="#" aria-label="YouTube" className="hover:text-red-500">
          <FaYoutube size={20} />
        </a>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <p className="text-sm">
          Email: <a href="mailto:support@fixora.com" className="hover:underline">support@fixora.com</a>
        </p>
        <p className="text-sm">
          Phone: <a href="tel:+1234567890" className="hover:underline">+91 (000) 000-000</a>
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