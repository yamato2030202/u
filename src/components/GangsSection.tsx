import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skull, MapPin } from "lucide-react";

const GangsSection = () => {
  const { data: gangs, isLoading } = useQuery({
    queryKey: ["gangs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("gangs").select("*").order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  if (!gangs || gangs.length === 0) return null;

  return (
    <section id="gangs" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">THE UNDERWORLD</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            <span className="text-primary">GANGS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {gangs.map((gang: any, i: number) => (
            <motion.div key={gang.id} className="bg-background p-8 flex flex-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              {gang.image_url ? (
                <img src={gang.image_url} alt={gang.name} className="w-full h-40 object-cover mb-4 border border-border" />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center mb-4">
                  <Skull className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              <h3 className="font-heading text-lg font-black text-foreground mb-2">{gang.name}</h3>
              {gang.description && <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{gang.description}</p>}
              <div className="flex items-center gap-4 mt-auto">
                {gang.territory && (
                  <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {gang.territory}
                  </span>
                )}
                {gang.is_recruiting && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 font-heading text-[10px] font-bold uppercase">RECRUITING</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GangsSection;
