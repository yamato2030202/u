import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { motion } from "framer-motion";

const StaffSection = () => {
  const { data: staff, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="staff" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">THE TEAM</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            OUR <span className="text-primary">STAFF</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background p-8 animate-pulse text-center">
                <div className="w-28 h-28 bg-muted mx-auto mb-4" />
                <div className="h-5 w-24 bg-muted mx-auto mb-2" />
                <div className="h-4 w-16 bg-muted mx-auto" />
              </div>
            ))}
          </div>
        ) : staff && staff.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
            {staff.map((member, i) => (
              <motion.div key={member.id} className="bg-background p-8 text-center group" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="w-28 h-28 mx-auto mb-4 border-2 border-border group-hover:border-primary transition-colors overflow-hidden">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-heading text-sm font-black text-foreground uppercase tracking-wider">{member.name}</h3>
                <p className="font-body text-xs text-primary font-bold uppercase tracking-wider mt-1">{member.role}</p>
                {member.discord_id && (
                  <p className="font-mono text-[10px] text-muted-foreground mt-2">{member.discord_id}</p>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-border p-12 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-lg text-muted-foreground">Staff team coming soon</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StaffSection;
