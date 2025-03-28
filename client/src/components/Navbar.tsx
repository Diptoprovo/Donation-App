
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Update scrolled state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
  
  if (isAuthPage) return null;
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-medium bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Kind<span className="font-semibold">Share</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6 text-sm font-medium">
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">Browse Items</Link>
              <Link to="/item-upload" className="text-foreground/80 hover:text-primary transition-colors">Donate</Link>
              <Link to="/transactions" className="text-foreground/80 hover:text-primary transition-colors">My Activity</Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="h-9 rounded-full px-4">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="h-9 rounded-full px-4">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-5 space-y-4 bg-background border-b border-gray-200/50">
            <Link to="/dashboard" className="block py-2 text-foreground/80 hover:text-primary">
              Browse Items
            </Link>
            <Link to="/item-upload" className="block py-2 text-foreground/80 hover:text-primary">
              Donate
            </Link>
            <Link to="/transactions" className="block py-2 text-foreground/80 hover:text-primary">
              My Activity
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/signin">
                <Button variant="outline" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full justify-start">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
