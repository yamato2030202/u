import { motion } from "framer-motion";

const stats = [
  { value: "400+", label: "CARS" },
  { value: "50+", label: "JOBS" },
  { value: "24/7", label: "ACTIVE" },
  { value: "64", label: "SLOTS" },
];

const AboutSection = () => {
  return (
    <section id="about" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">ABOUT THE SERVER</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            BUILT FOR THE <span className="text-primary">STREETS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border mb-16">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} className="bg-background p-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl lg:text-5xl font-heading font-black text-primary mb-2">{stat.value}</div>
              <div className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-px bg-border">
          {[
            { title: "ECONOMY", desc: "A realistic economy system where every dollar matters. Work your way up from nothing, start a business, or take the criminal route." },
            { title: "COMMUNITY", desc: "An active community of dedicated roleplayers. Regular events, active staff, and constant updates keep the experience fresh." },
            { title: "CUSTOM CONTENT", desc: "Hundreds of custom vehicles, clothing, and MLOs. Every corner of the city has been crafted to deliver an immersive experience." },
            { title: "FACTIONS", desc: "Join established factions or build your own crew. Police, EMS, mechanics, gangs — every role has depth and purpose." },
          ].map((item, i) => (
            <motion.div key={item.title} className="bg-background p-8 lg:p-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <h3 className="text-xl font-heading font-black text-foreground mb-4">{item.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
