import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9FC]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#212121] mb-4">404</h1>
        <p className="text-xl text-[#616161] mb-4">Oops! Page not found</p>
        <a href="/" className="text-[#1E88E5] hover:text-[#43A047] underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;