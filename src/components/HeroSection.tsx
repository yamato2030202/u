import { Car, Shield, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import asphaltBg from "@/assets/asphalt-texture.jpg";
import logo from "@/assets/urban-legends-logo.png";
import { useFivemPlayers } from "@/hooks/useFivemPlayers";

const features = [
  { icon: Car, label: "400+ CARS" },
  { icon: Shield, label: "FACTIONS" },
  { icon: Users, label: "EVENTS" },
  { icon: Briefcase, label: "JOBS" },
];

const HeroSection = () => {
  const { data: serverData } = useFivemPlayers("jjl3am");

  return (
    <section id="home" className="snap-section relative flex items-center min-h-screen lg:pl-20">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${asphaltBg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 border border-border px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full animate-pulse bg-primary" />
              <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">Season 1: New Beginnings</span>
            </div>

            <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">WELCOME TO LOS SANTOS</p>
            <h1 className="text-5xl lg:text-7xl font-heading font-black text-primary leading-none mb-1">URBAN</h1>
            <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-8">LEGENDS</h2>

            <p className="font-body text-muted-foreground text-sm lg:text-base max-w-md leading-relaxed mb-8">
              Step into a living, breathing city where your choices define your destiny. From the highest peaks of Mount Chiliad to the darkest alleys of the South Side, write your own story in the most immersive FiveM server.
            </p>

            <div className="inline-flex items-center gap-3 border border-border px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: serverData && serverData.players > 0 ? "hsl(120, 60%, 50%)" : "hsl(0, 0%, 40%)" }} />
              <span className="font-mono text-xs text-muted-foreground">{serverData ? `${serverData.players} / ${serverData.maxPlayers}` : "0 / 64"} Players Connected</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {["Whitelisted Jobs & Gangs", "Realistic Economy System", "Custom Clothing & Cars", "Active Staff & Development"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-primary text-sm">✓</span>
                  <span className="font-body text-xs text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="fivem://connect/jjl3am" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-heading font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity">⚡ CONNECT NOW</a>
              <a href="#rules" className="inline-flex items-center gap-2 border-2 border-border text-foreground px-8 py-3 font-heading font-bold text-sm uppercase tracking-wider hover:border-primary hover:text-primary transition-colors">→ READ RULES</a>
            </div>
          </motion.div>

          <motion.div className="hidden lg:flex relative items-center justify-center" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="relative">
              <img src={logo} alt="Urban Legends Logo" className="w-80 h-80 object-contain opacity-90" />
              {features.map((feat, i) => {
                const positions = ["top-0 right-0 translate-x-12", "bottom-8 left-0 -translate-x-16", "top-1/3 right-0 translate-x-20", "bottom-0 right-1/4"];
                return (
                  <motion.div key={feat.label} className={`absolute ${positions[i]} border border-border bg-card/80 backdrop-blur-sm px-4 py-3 flex flex-col items-center gap-1`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15 }}>
                    <feat.icon className="w-5 h-5 text-primary" strokeWidth={2.5} />
                    <span className="font-heading text-[10px] font-bold text-foreground uppercase tracking-wider">{feat.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
};

export default HeroSection;
