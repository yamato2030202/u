import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Megaphone, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, any> = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  event: Megaphone,
};

const colorMap: Record<string, string> = {
  info: "bg-primary/10 border-primary/30 text-primary",
  warning: "bg-destructive/10 border-destructive/30 text-destructive",
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  event: "bg-accent/10 border-accent/30 text-accent",
};

const AnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("announcements").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const visible = announcements?.filter((a: any) => !dismissed.includes(a.id)) || [];
  if (visible.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 lg:left-20">
      <AnimatePresence>
        {visible.map((ann: any) => {
          const Icon = iconMap[ann.type] || Info;
          const colors = colorMap[ann.type] || colorMap.info;
          return (
            <motion.div
              key={ann.id}
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className={`border-b ${colors} px-6 py-3 flex items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className="w-4 h-4 shrink-0" />
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-heading text-xs font-bold uppercase shrink-0">{ann.title}</span>
                  <span className="font-body text-xs opacity-80 truncate">{ann.message}</span>
                </div>
              </div>
              <button onClick={() => setDismissed((d) => [...d, ann.id])} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AnnouncementBanner;
