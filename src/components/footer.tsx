
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
      <p className="text-sm text-gray-400">
        &copy; 2024 ScrumManager. All rights reserved.
      </p>
      <div className="space-x-4">
        <a
          href="#"
          className="text-gray-400 hover:text-gray-300"
          aria-label="Facebook"
        >
          Facebook
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-gray-300"
          aria-label="Twitter"
        >
          Twitter
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-gray-300"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;