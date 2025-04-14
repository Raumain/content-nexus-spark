
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="h-24 w-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <FileQuestion className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-primary-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          We couldn't find the page you're looking for
        </p>
        <p className="text-gray-500 mb-8">
          The page at <span className="font-medium">{location.pathname}</span> might have been moved or deleted.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to={-1 as any}>Go Back</Link>
          </Button>
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
