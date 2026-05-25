import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skull, MapPin, Star } from "lucide-react";

const TopGangsSection = () => {
  const { data: gangs } = useQuery({
    queryKey: ["top-gangs"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("gangs").select("*").eq("is_featured", true).order("sort_order").limit(3);
      if (error) throw error;
      return data as any[];
    },
  });

  if (!gangs || gangs.length === 0) return null;

  return (
    <section className="relative lg:pl-20 border-t border-border py-16">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-8">
          <Star className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-2xl font-black text-foreground">TOP <span className="text-primary">GANGS</span></h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {gangs.map((gang: any, i: number) => (
            <motion.div
              key={gang.id}
              className="bg-background p-6 flex flex-col items-center text-center relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-heading text-sm font-black">
                #{i + 1}
              </div>
              {gang.image_url ? (
                <img src={gang.image_url} alt={gang.name} className="w-24 h-24 object-cover border-2 border-primary mb-4" />
              ) : (
                <div className="w-24 h-24 bg-muted flex items-center justify-center mb-4 border-2 border-primary">
                  <Skull className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
              <h4 className="font-heading text-lg font-black text-foreground mb-1">{gang.name}</h4>
              {gang.territory && (
                <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground mb-2">
                  <MapPin className="w-3 h-3" /> {gang.territory}
                </span>
              )}
              {gang.description && <p className="font-body text-xs text-muted-foreground leading-relaxed line-clamp-2">{gang.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopGangsSection;
