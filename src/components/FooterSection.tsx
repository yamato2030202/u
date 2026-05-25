import { Link } from "react-router-dom";
import logo from "@/assets/urban-legends-logo.png";

const FooterSection = () => {
  return (
    <footer className="lg:pl-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Urban Legends" className="h-10 w-auto object-contain" />
            <div>
              <h3 className="font-heading text-2xl font-black text-foreground mb-1">URBAN LEGENDS</h3>
              <p className="font-body text-xs text-muted-foreground">The most immersive FiveM roleplay experience.</p>
            </div>
          </div>

          <div className="flex gap-8">
            <a href="https://discord.gg/urbanlegends" target="_blank" rel="noopener noreferrer" className="font-heading text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors">DISCORD</a>
            <Link to="/store" className="font-heading text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors">STORE</Link>
            <Link to="/contact" className="font-heading text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors">CONTACT</Link>
            <Link to="/admin/login" className="font-heading text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors">ADMIN</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest">© 2024 URBAN LEGENDS ROLEPLAY. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
