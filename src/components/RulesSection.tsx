import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Shield, Skull, ScrollText } from "lucide-react";
import { useState } from "react";

const fallbackRules = [
  { number: "01", title: "RESPECT ALL PLAYERS", description: "No harassment, discrimination, or toxic behavior.", category: "general" },
  { number: "02", title: "NO METAGAMING", description: "Do not use out-of-character information for in-character advantage.", category: "general" },
  { number: "03", title: "NO POWERGAMING", description: "Do not force actions on other players.", category: "general" },
  { number: "04", title: "VALUE YOUR LIFE", description: "Your character values their life.", category: "general" },
  { number: "05", title: "NO RDM / VDM", description: "Random Deathmatch and Vehicle Deathmatch are strictly prohibited.", category: "general" },
  { number: "06", title: "FOLLOW STAFF INSTRUCTIONS", description: "Staff decisions are final.", category: "general" },
];

const categoryConfig: Record<string, { label: string; icon: any }> = {
  general: { label: "GENERAL", icon: ScrollText },
  police: { label: "POLICE", icon: Shield },
  gang: { label: "GANG", icon: Skull },
};

const RulesSection = () => {
  const [activeCategory, setActiveCategory] = useState("general");

  const { data: dbRules } = useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("rules").select("*").order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  const rules = dbRules && dbRules.length > 0 ? dbRules : fallbackRules;
  const categories = [...new Set(rules.map((r: any) => r.category || "general"))];
  const filteredRules = rules.filter((r: any) => (r.category || "general") === activeCategory);

  return (
    <section id="rules" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">SERVER GUIDELINES</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-8">
            THE <span className="text-primary">RULES</span>
          </h2>
        </motion.div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-px bg-border mb-8 w-fit">
            {categories.map((cat: string) => {
              const config = categoryConfig[cat] || { label: cat.toUpperCase(), icon: ScrollText };
              const Icon = config.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
                    activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {config.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="grid gap-px bg-border">
          {filteredRules.map((rule: any, i: number) => (
            <motion.div key={rule.number || i} className="bg-background flex items-start gap-6 p-6 lg:p-8" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <span className="font-heading text-3xl lg:text-4xl font-black text-primary/30 leading-none shrink-0">{rule.number}</span>
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground mb-1 tracking-wider">{rule.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{rule.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
