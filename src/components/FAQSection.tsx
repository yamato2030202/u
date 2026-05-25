import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const fallbackFaq = [
  { question: "How do I join the server?", answer: "Click the 'Connect Now' button or use the FiveM client to connect directly to our server." },
  { question: "Is the server whitelisted?", answer: "The server itself is not whitelisted, but some jobs and factions require a whitelist application through Discord." },
  { question: "What are the system requirements?", answer: "You need GTA V and the FiveM client installed. We recommend at least 8GB RAM and a decent GPU for the best experience." },
  { question: "How do I apply for a whitelisted job?", answer: "Join our Discord server and check the application channels for available positions." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: dbFaq } = useQuery({
    queryKey: ["faq"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("faq").select("*").order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  const faq = dbFaq && dbFaq.length > 0 ? dbFaq : fallbackFaq;

  return (
    <section id="faq" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">GOT QUESTIONS?</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            <span className="text-primary">FAQ</span>
          </h2>
        </motion.div>

        <div className="space-y-px bg-border">
          {faq.map((item: any, i: number) => (
            <motion.div key={i} className="bg-background" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 lg:p-8 text-left group"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-heading text-sm font-bold text-foreground tracking-wider">{item.question}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 lg:px-8 pb-6 lg:pb-8 pl-16 lg:pl-20">
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
