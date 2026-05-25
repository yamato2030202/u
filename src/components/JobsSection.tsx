import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Shield, Play } from "lucide-react";
import { motion } from "framer-motion";

const JobsSection = () => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="jobs" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">AVAILABLE POSITIONS</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            SERVER <span className="text-primary">JOBS</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-background p-8 animate-pulse">
                <div className="h-16 w-16 bg-muted mb-4" />
                <div className="h-6 w-32 bg-muted mb-2" />
                <div className="h-4 w-full bg-muted" />
              </div>
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {jobs.map((job, i) => (
              <motion.div key={job.id} className="bg-background p-8 flex flex-col" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center gap-3 mb-4">
                  {job.icon_url ? (
                    <img src={job.icon_url} alt={job.title} className="w-16 h-16 object-contain" />
                  ) : (
                    <Briefcase className="w-16 h-16 text-primary" />
                  )}
                  {job.is_whitelisted && (
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 font-heading text-[10px] font-bold uppercase">
                      <Shield className="w-3 h-3" /> WHITELISTED
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-lg font-black text-foreground mb-2">{job.title}</h3>
                {job.description && (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{job.description}</p>
                )}
                {job.salary_range && (
                  <p className="font-mono text-xs text-primary font-bold">💰 {job.salary_range}</p>
                )}
                {(job as any).video_url && (
                  <a href={(job as any).video_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-primary font-heading text-xs font-bold uppercase hover:opacity-80 transition-opacity">
                    <Play className="w-4 h-4" /> WATCH VIDEO
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-border p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-lg text-muted-foreground">No jobs available yet</p>
            <p className="font-body text-sm text-muted-foreground">Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobsSection;
