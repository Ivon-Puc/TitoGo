

const Footer = () => {
    return (
      <footer className="bg-black text-white py-8 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Project Name with Hover Effect */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold hover:text-gray-400 transition duration-300">
                Carpool
              </h2>
            </div>
  
            {/* Copyright Notice */}
            <div className="mt-4 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Carpool. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;