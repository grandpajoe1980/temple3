const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Temple3. All rights reserved.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
