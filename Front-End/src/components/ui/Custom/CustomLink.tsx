const CustomLink: React.FC<{ href: string; label: string; className?: string }> = ({
  href, label, className
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer" 
    className= {` ${className} block text-blue-500 dark:text-blue-500 hover:text-blue-800 text-sm font-semibold`}
  >
    {label}
  </a>
);

export default CustomLink;

// rel="noopener noreferrer" to prevent: 
// Tabnabbing attacks (malicious site hijacks your original tab)
// Leaking your page URL as a referrer