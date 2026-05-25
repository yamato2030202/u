import logo from "@/assets/urban-legends-logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, Info, ScrollText, Briefcase, Users, ShoppingCart, LogIn, Image, User, MessageSquare } from "lucide-react";

const navLinks = [
  { label: "HOME", href: "#home", icon: Home },
  { label: "ABOUT", href: "#about", icon: Info },
  { label: "RULES", href: "#rules", icon: ScrollText },
  { label: "JOBS", href: "#jobs", icon: Briefcase },
  { label: "GALLERY", href: "#gallery", icon: Image },
  { label: "STAFF", href: "#staff", icon: Users },
];

const Navbar = () => {
  const { user } = useAuth();

  return (
    <>
      {/* Top bar for mobile */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-background/90 backdrop-blur-sm border-b border-border lg:hidden">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Urban Legends" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex gap-3">
          <Link to="/store" className="flex items-center gap-1.5 px-3 py-2 border border-border text-foreground font-heading font-bold text-xs uppercase tracking-wide hover:border-primary hover:text-primary transition-colors">
            <ShoppingCart className="w-3.5 h-3.5" /> STORE
          </Link>
          {user ? (
            <Link to="/profile" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-heading font-bold text-xs uppercase tracking-wide">
              <User className="w-3.5 h-3.5" /> PROFILE
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-heading font-bold text-xs uppercase tracking-wide">
              <LogIn className="w-3.5 h-3.5" /> JOIN
            </Link>
          )}
        </div>
      </nav>

      {/* Side nav for desktop */}
      <nav className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col justify-between w-20 border-r border-border bg-background/90 backdrop-blur-sm">
        <div className="flex flex-col items-center pt-6">
          <img src={logo} alt="Urban Legends" className="h-12 w-auto object-contain mb-8" />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="w-full py-4 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group"
            >
              <link.icon className="w-4 h-4" />
              <span className="font-heading text-[8px] font-bold uppercase tracking-widest">{link.label}</span>
            </a>
          ))}
          <Link to="/contact" className="w-full py-4 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors group">
            <MessageSquare className="w-4 h-4" />
            <span className="font-heading text-[8px] font-bold uppercase tracking-widest">CONTACT</span>
          </Link>
        </div>
        <div className="flex flex-col items-center pb-6 gap-2">
          <Link to="/store" className="w-full py-3 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-heading text-[8px] font-bold uppercase tracking-widest">STORE</span>
          </Link>
          {user ? (
            <Link to="/profile" className="w-full py-3 flex flex-col items-center gap-1 text-primary transition-colors">
              <User className="w-4 h-4" />
              <span className="font-heading text-[8px] font-bold uppercase tracking-widest">PROFILE</span>
            </Link>
          ) : (
            <Link to="/auth" className="w-full py-3 flex flex-col items-center gap-1 text-primary transition-colors">
              <LogIn className="w-4 h-4" />
              <span className="font-heading text-[8px] font-bold uppercase tracking-widest">JOIN</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
