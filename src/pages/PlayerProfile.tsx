import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Crown, User, LogOut } from "lucide-react";
import logo from "@/assets/urban-legends-logo.png";

const PlayerProfile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*").eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  if (loading || !user) return null;

  const isVip = profile?.is_vip || roles?.some(r => r.role === 'admin');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Urban Legends" className="h-12 w-auto" />
        </div>

        <div className="border border-border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-muted flex items-center justify-center border border-border">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-lg font-black text-foreground">{profile?.display_name || user.email}</h2>
              <p className="font-body text-xs text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-1">
                {isVip && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 font-heading text-[10px] font-bold">
                    <Crown className="w-3 h-3" /> VIP
                  </span>
                )}
                {roles?.map(r => (
                  <span key={r.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 font-heading text-[10px] font-bold uppercase">
                    {r.role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-body text-sm text-muted-foreground">Member Since</span>
              <span className="font-body text-sm text-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="font-body text-sm text-muted-foreground">Status</span>
              <span className="font-body text-sm text-primary font-bold">Active</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="flex-1 border border-border py-3 font-heading font-bold text-xs uppercase text-foreground hover:border-primary transition-colors">
              HOME
            </button>
            <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center justify-center gap-2 flex-1 bg-destructive/10 text-destructive py-3 font-heading font-bold text-xs uppercase hover:bg-destructive/20 transition-colors">
              <LogOut className="w-3 h-3" /> LOGOUT
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlayerProfile;
