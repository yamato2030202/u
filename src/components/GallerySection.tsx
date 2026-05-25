import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Image, Play } from "lucide-react";
import { useState } from "react";

const GallerySection = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: items } = useQuery({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("gallery").select("*").order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  if (!items || items.length === 0) return null;

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <section id="gallery" className="snap-section relative flex items-center min-h-screen lg:pl-20 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.3em] mb-2">MOMENTS</p>
          <h2 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-12">
            <span className="text-primary">GALLERY</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {items.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              className="relative aspect-square overflow-hidden cursor-pointer group border border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedItem(item)}
            >
              {item.media_type === "video" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  {item.media_url && getYoutubeEmbedUrl(item.media_url) ? (
                    <img src={`https://img.youtube.com/vi/${item.media_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/)?.[1]}/hqdefault.jpg`} className="w-full h-full object-cover" alt={item.title || "Video"} />
                  ) : (
                    <Play className="w-12 h-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-primary/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={item.media_url} alt={item.title || "Gallery"} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                {item.title && <p className="font-heading text-xs font-bold text-foreground">{item.title}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-6"
          onClick={() => setSelectedItem(null)}
        >
          <button className="absolute top-6 right-6 font-heading text-sm font-bold text-muted-foreground hover:text-foreground">✕ CLOSE</button>
          <div className="max-w-4xl w-full max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            {selectedItem.media_type === "video" && getYoutubeEmbedUrl(selectedItem.media_url) ? (
              <div className="aspect-video">
                <iframe src={getYoutubeEmbedUrl(selectedItem.media_url)!} className="w-full h-full" allowFullScreen allow="autoplay" />
              </div>
            ) : (
              <img src={selectedItem.media_url} alt={selectedItem.title || "Gallery"} className="w-full h-auto max-h-[80vh] object-contain" />
            )}
            {selectedItem.title && <p className="font-heading text-sm font-bold text-foreground mt-4">{selectedItem.title}</p>}
            {selectedItem.description && <p className="font-body text-sm text-muted-foreground mt-1">{selectedItem.description}</p>}
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default GallerySection;
