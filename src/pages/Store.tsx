import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowLeft, Crown, Check, Star } from "lucide-react";
import asphaltBg from "@/assets/asphalt-texture.jpg";

const Store = () => {
  const { data: packages, isLoading } = useQuery({
    queryKey: ["vip_packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vip_packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${asphaltBg})`, backgroundSize: "cover" }} />
      <div className="absolute inset-0 bg-background/90" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-heading text-sm font-bold uppercase tracking-wider mb-12">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>

        <div className="text-center mb-16">
          <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-5xl lg:text-7xl font-heading font-black text-foreground leading-none mb-4">
            VIP <span className="text-primary">STORE</span>
          </h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Unlock exclusive perks and support the server with a VIP package.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border p-8 animate-pulse">
                <div className="h-8 w-32 bg-muted mb-4" />
                <div className="h-12 w-24 bg-muted mb-6" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => <div key={j} className="h-4 bg-muted" />)}
                </div>
              </div>
            ))}
          </div>
        ) : packages && packages.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border p-8 flex flex-col ${
                  pkg.is_popular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 font-heading text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3" /> POPULAR
                  </div>
                )}

                <h3 className="font-heading text-xl font-black text-foreground uppercase mb-2">
                  {pkg.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-heading font-black text-primary">
                    {pkg.price}
                  </span>
                  <span className="text-sm font-body text-muted-foreground ml-1">
                    {pkg.currency}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="font-body text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://discord.gg/urbanlegends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 text-center font-heading font-bold text-sm uppercase tracking-wider transition-opacity hover:opacity-90 ${
                    pkg.is_popular
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  PURCHASE
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border p-16 text-center">
            <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-xl text-muted-foreground">VIP packages coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
