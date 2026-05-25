import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Users, Crown, Settings, LogOut, Plus, Trash2, Edit, Save, X, Upload, ScrollText, Skull, HelpCircle, Image, UserCog, Megaphone, MessageSquare, Mail } from "lucide-react";

type Tab = "jobs" | "staff" | "vip" | "rules" | "gangs" | "faq" | "gallery" | "users" | "announcements" | "messages" | "settings";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-heading text-muted-foreground">Loading...</p></div>;
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "jobs", label: "JOBS", icon: Briefcase },
    { id: "staff", label: "STAFF", icon: Users },
    { id: "vip", label: "VIP", icon: Crown },
    { id: "rules", label: "RULES", icon: ScrollText },
    { id: "gangs", label: "GANGS", icon: Skull },
    { id: "gallery", label: "GALLERY", icon: Image },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "users", label: "USERS", icon: UserCog },
    { id: "announcements", label: "BANNERS", icon: Megaphone },
    { id: "messages", label: "MESSAGES", icon: MessageSquare },
    { id: "settings", label: "SETTINGS", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-xl font-black text-primary">URBAN LEGENDS</h1>
          <span className="font-body text-xs text-muted-foreground uppercase">Admin Panel</span>
        </div>
        <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors font-heading text-xs font-bold uppercase">
          <LogOut className="w-4 h-4" /> LOGOUT
        </button>
      </header>
      <div className="flex">
        <aside className="w-56 border-r border-border min-h-[calc(100vh-57px)] overflow-y-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 font-heading text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id ? "bg-primary/10 text-primary border-r-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-57px)]">
          {activeTab === "jobs" && <JobsManager />}
          {activeTab === "staff" && <StaffManager />}
          {activeTab === "vip" && <VIPManager />}
          {activeTab === "rules" && <RulesManager />}
          {activeTab === "gangs" && <GangsManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "faq" && <FAQManager />}
          {activeTab === "users" && <UsersManager />}
          {activeTab === "announcements" && <AnnouncementsManager />}
          {activeTab === "messages" && <MessagesManager />}
          {activeTab === "settings" && <SettingsManager />}
        </main>
      </div>
    </div>
  );
};

const uploadImage = async (file: File, folder: string) => {
  const ext = file.name.split(".").pop();
  const name = `${folder}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("images").upload(name, file);
  if (error) throw error;
  const { data } = supabase.storage.from("images").getPublicUrl(name);
  return data.publicUrl;
};

const inputClass = "w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary";
const btnPrimary = "flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 font-heading text-xs font-bold uppercase";
const btnSecondary = "flex items-center gap-2 border border-border text-foreground px-6 py-2 font-heading text-xs font-bold uppercase";

// ── Jobs Manager ──
const JobsManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", salary_range: "", is_whitelisted: false, icon_url: "", video_url: "" });

  const { data: jobs } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => { const { data, error } = await supabase.from("jobs").select("*").order("sort_order"); if (error) throw error; return data; },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      if (data.id) { const { error } = await supabase.from("jobs").update(data).eq("id", data.id); if (error) throw error; }
      else { const { error } = await supabase.from("jobs").insert(data); if (error) throw error; }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("jobs").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-jobs"] }),
  });

  const resetForm = () => { setEditing(null); setForm({ title: "", description: "", salary_range: "", is_whitelisted: false, icon_url: "", video_url: "" }); };
  const startEdit = (job: any) => { setEditing(job.id); setForm({ title: job.title, description: job.description || "", salary_range: job.salary_range || "", is_whitelisted: job.is_whitelisted || false, icon_url: job.icon_url || "", video_url: (job as any).video_url || "" }); };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "jobs"); setForm((f) => ({ ...f, icon_url: url })); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE JOBS</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD JOB</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Job Title" className={inputClass} />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className={inputClass + " resize-none"} />
          <input value={form.salary_range} onChange={(e) => setForm((f) => ({ ...f, salary_range: e.target.value }))} placeholder="Salary Range" className={inputClass} />
          <input value={form.video_url} onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))} placeholder="YouTube Video URL (optional)" className={inputClass} />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.is_whitelisted} onChange={(e) => setForm((f) => ({ ...f, is_whitelisted: e.target.checked }))} className="accent-primary" /> Whitelisted
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer border border-border px-3 py-1.5">
              <Upload className="w-4 h-4 text-muted-foreground" /> Icon <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {form.icon_url && <img src={form.icon_url} className="w-12 h-12 object-contain" />}
          </div>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {jobs?.map((job) => (
          <div key={job.id} className="border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {job.icon_url ? <img src={job.icon_url} className="w-12 h-12 object-contain" /> : <Briefcase className="w-12 h-12 text-muted-foreground" />}
              <div><p className="font-heading text-sm font-bold text-foreground">{job.title}</p><p className="font-body text-xs text-muted-foreground">{job.salary_range || "No salary set"}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(job)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(job.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Staff Manager ──
const StaffManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", discord_id: "", avatar_url: "" });
  const { data: staff } = useQuery({ queryKey: ["admin-staff"], queryFn: async () => { const { data, error } = await supabase.from("staff").select("*").order("sort_order"); if (error) throw error; return data; } });
  const saveMutation = useMutation({ mutationFn: async (data: typeof form & { id?: string }) => { if (data.id) { const { error } = await supabase.from("staff").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await supabase.from("staff").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-staff"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("staff").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-staff"] }) });
  const resetForm = () => { setEditing(null); setForm({ name: "", role: "", discord_id: "", avatar_url: "" }); };
  const startEdit = (s: any) => { setEditing(s.id); setForm({ name: s.name, role: s.role, discord_id: s.discord_id || "", avatar_url: s.avatar_url || "" }); };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "staff"); setForm((f) => ({ ...f, avatar_url: url })); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE STAFF</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD MEMBER</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className={inputClass} />
          <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Role" className={inputClass} />
          <input value={form.discord_id} onChange={(e) => setForm((f) => ({ ...f, discord_id: e.target.value }))} placeholder="Discord ID (optional)" className={inputClass} />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer border border-border px-4 py-2"><Upload className="w-4 h-4 text-muted-foreground" /> Avatar <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
            {form.avatar_url && <img src={form.avatar_url} className="w-16 h-16 object-cover border border-border" />}
          </div>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {staff?.map((s) => (
          <div key={s.id} className="border border-border p-4 text-center relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(s)} className="p-1 text-muted-foreground hover:text-primary"><Edit className="w-3 h-3" /></button>
              <button onClick={() => deleteMutation.mutate(s.id)} className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
            </div>
            {s.avatar_url ? <img src={s.avatar_url} className="w-20 h-20 object-cover mx-auto mb-2 border border-border" /> : <div className="w-20 h-20 bg-muted mx-auto mb-2 flex items-center justify-center"><Users className="w-8 h-8 text-muted-foreground" /></div>}
            <p className="font-heading text-xs font-bold text-foreground">{s.name}</p>
            <p className="font-body text-[10px] text-primary">{s.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── VIP Manager ──
const VIPManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, currency: "MAD", features: "", is_popular: false, image_url: "" });
  const { data: packages } = useQuery({ queryKey: ["admin-vip"], queryFn: async () => { const { data, error } = await supabase.from("vip_packages").select("*").order("sort_order"); if (error) throw error; return data; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { const payload = { ...data, features: data.features.split("\n").filter((f: string) => f.trim()) }; if (data.id) { const { error } = await supabase.from("vip_packages").update(payload).eq("id", data.id); if (error) throw error; } else { const { error } = await supabase.from("vip_packages").insert(payload); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-vip"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("vip_packages").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vip"] }) });
  const resetForm = () => { setEditing(null); setForm({ name: "", price: 0, currency: "MAD", features: "", is_popular: false, image_url: "" }); };
  const startEdit = (pkg: any) => { setEditing(pkg.id); setForm({ name: pkg.name, price: pkg.price, currency: pkg.currency || "MAD", features: (pkg.features || []).join("\n"), is_popular: pkg.is_popular || false, image_url: (pkg as any).image_url || "" }); };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "vip"); setForm((f) => ({ ...f, image_url: url })); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE VIP PACKAGES</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD PACKAGE</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Package Name" className={inputClass} />
          <div className="flex gap-4">
            <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) }))} placeholder="Price" className={inputClass + " flex-1"} />
            <input value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} placeholder="Currency" className={inputClass + " w-24"} />
          </div>
          <textarea value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder="Features (one per line)" rows={5} className={inputClass + " resize-none"} />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer"><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm((f) => ({ ...f, is_popular: e.target.checked }))} className="accent-primary" /> Popular</label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer border border-border px-3 py-1.5"><Upload className="w-4 h-4 text-muted-foreground" /> Image <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
            {form.image_url && <img src={form.image_url} className="w-16 h-16 object-cover border border-border" />}
          </div>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {packages?.map((pkg) => (
          <div key={pkg.id} className="border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {(pkg as any).image_url && <img src={(pkg as any).image_url} className="w-12 h-12 object-cover border border-border" />}
              <div><p className="font-heading text-sm font-bold text-foreground">{pkg.name} {pkg.is_popular && <span className="text-primary text-[10px]">★ POPULAR</span>}</p><p className="font-mono text-xs text-primary">{pkg.price} {pkg.currency}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(pkg)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(pkg.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Rules Manager ──
const RulesManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ number: "", title: "", description: "", category: "general" });
  const { data: rules } = useQuery({ queryKey: ["admin-rules"], queryFn: async () => { const { data, error } = await (supabase as any).from("rules").select("*").order("sort_order"); if (error) throw error; return data as any[]; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { if (data.id) { const { error } = await (supabase as any).from("rules").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await (supabase as any).from("rules").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-rules"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("rules").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-rules"] }) });
  const resetForm = () => { setEditing(null); setForm({ number: "", title: "", description: "", category: "general" }); };
  const startEdit = (r: any) => { setEditing(r.id); setForm({ number: r.number, title: r.title, description: r.description, category: r.category || "general" }); };

  const categories = ["general", "police", "gang"];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE RULES</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD RULE</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} placeholder="Rule Number (e.g. 01)" className={inputClass} />
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Rule Title" className={inputClass} />
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={inputClass}>
            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Rule Description" rows={3} className={inputClass + " resize-none"} />
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {rules?.map((rule: any) => (
          <div key={rule.id} className="border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-heading text-2xl font-black text-primary/30">{rule.number}</span>
              <div>
                <p className="font-heading text-sm font-bold text-foreground">{rule.title}</p>
                <div className="flex gap-2 items-center">
                  <span className="bg-secondary text-secondary-foreground px-2 py-0.5 font-heading text-[9px] font-bold uppercase">{rule.category || "general"}</span>
                  <p className="font-body text-xs text-muted-foreground line-clamp-1">{rule.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(rule)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(rule.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Gangs Manager ──
const GangsManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image_url: "", territory: "", is_recruiting: false, is_featured: false });
  const { data: gangs } = useQuery({ queryKey: ["admin-gangs"], queryFn: async () => { const { data, error } = await (supabase as any).from("gangs").select("*").order("sort_order"); if (error) throw error; return data as any[]; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { if (data.id) { const { error } = await (supabase as any).from("gangs").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await (supabase as any).from("gangs").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gangs"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("gangs").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gangs"] }) });
  const resetForm = () => { setEditing(null); setForm({ name: "", description: "", image_url: "", territory: "", is_recruiting: false, is_featured: false }); };
  const startEdit = (g: any) => { setEditing(g.id); setForm({ name: g.name, description: g.description || "", image_url: g.image_url || "", territory: g.territory || "", is_recruiting: g.is_recruiting || false, is_featured: g.is_featured || false }); };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "gangs"); setForm((f) => ({ ...f, image_url: url })); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE GANGS</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD GANG</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Gang Name" className={inputClass} />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className={inputClass + " resize-none"} />
          <input value={form.territory} onChange={(e) => setForm((f) => ({ ...f, territory: e.target.value }))} placeholder="Territory" className={inputClass} />
          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer"><input type="checkbox" checked={form.is_recruiting} onChange={(e) => setForm((f) => ({ ...f, is_recruiting: e.target.checked }))} className="accent-primary" /> Recruiting</label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-primary" /> ⭐ Featured (Top 3)</label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer border border-border px-3 py-1.5"><Upload className="w-4 h-4 text-muted-foreground" /> Image <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
            {form.image_url && <img src={form.image_url} className="w-16 h-16 object-cover border border-border" />}
          </div>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {gangs?.map((gang: any) => (
          <div key={gang.id} className="border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {gang.image_url ? <img src={gang.image_url} className="w-12 h-12 object-cover border border-border" /> : <Skull className="w-12 h-12 text-muted-foreground" />}
              <div>
                <p className="font-heading text-sm font-bold text-foreground">
                  {gang.name} {gang.is_featured && <span className="text-primary text-[10px]">⭐ FEATURED</span>}
                </p>
                <p className="font-body text-xs text-muted-foreground">{gang.territory || "No territory"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(gang)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(gang.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Gallery Manager ──
const GalleryManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", media_url: "", media_type: "image" });
  const { data: items } = useQuery({ queryKey: ["admin-gallery"], queryFn: async () => { const { data, error } = await (supabase as any).from("gallery").select("*").order("sort_order"); if (error) throw error; return data as any[]; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { if (data.id) { const { error } = await (supabase as any).from("gallery").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await (supabase as any).from("gallery").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("gallery").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }) });
  const resetForm = () => { setEditing(null); setForm({ title: "", description: "", media_url: "", media_type: "image" }); };
  const startEdit = (item: any) => { setEditing(item.id); setForm({ title: item.title || "", description: item.description || "", media_url: item.media_url, media_type: item.media_type }); };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const url = await uploadImage(file, "gallery"); setForm((f) => ({ ...f, media_url: url, media_type: "image" })); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE GALLERY</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD MEDIA</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title (optional)" className={inputClass} />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" rows={2} className={inputClass + " resize-none"} />
          <select value={form.media_type} onChange={(e) => setForm((f) => ({ ...f, media_type: e.target.value }))} className={inputClass}>
            <option value="image">Image</option>
            <option value="video">Video (YouTube URL)</option>
          </select>
          {form.media_type === "video" ? (
            <input value={form.media_url} onChange={(e) => setForm((f) => ({ ...f, media_url: e.target.value }))} placeholder="YouTube URL" className={inputClass} />
          ) : (
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer border border-border px-4 py-2"><Upload className="w-4 h-4 text-muted-foreground" /> Upload Image <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
              {form.media_url && <img src={form.media_url} className="w-20 h-20 object-cover border border-border" />}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.map((item: any) => (
          <div key={item.id} className="border border-border relative group">
            {item.media_type === "image" ? (
              <img src={item.media_url} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-muted flex items-center justify-center"><Image className="w-8 h-8 text-muted-foreground" /></div>
            )}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(item)} className="p-1 bg-background/80 text-muted-foreground hover:text-primary"><Edit className="w-3 h-3" /></button>
              <button onClick={() => deleteMutation.mutate(item.id)} className="p-1 bg-background/80 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
            </div>
            {item.title && <p className="p-2 font-heading text-[10px] font-bold text-foreground">{item.title}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── FAQ Manager ──
const FAQManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const { data: faqs } = useQuery({ queryKey: ["admin-faq"], queryFn: async () => { const { data, error } = await (supabase as any).from("faq").select("*").order("sort_order"); if (error) throw error; return data as any[]; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { if (data.id) { const { error } = await (supabase as any).from("faq").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await (supabase as any).from("faq").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-faq"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("faq").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-faq"] }) });
  const resetForm = () => { setEditing(null); setForm({ question: "", answer: "" }); };
  const startEdit = (f: any) => { setEditing(f.id); setForm({ question: f.question, answer: f.answer }); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE FAQ</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD QUESTION</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="Question" className={inputClass} />
          <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} placeholder="Answer" rows={4} className={inputClass + " resize-none"} />
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {faqs?.map((faq: any) => (
          <div key={faq.id} className="border border-border p-4 flex items-center justify-between">
            <div><p className="font-heading text-sm font-bold text-foreground">{faq.question}</p><p className="font-body text-xs text-muted-foreground line-clamp-1">{faq.answer}</p></div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(faq)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(faq.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Users Manager ──
const UsersManager = () => {
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: allRoles } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const toggleVip = useMutation({
    mutationFn: async ({ userId, isVip }: { userId: string; isVip: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_vip: !isVip } as any).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const getUserRoles = (userId: string) => allRoles?.filter(r => r.user_id === userId) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE USERS</h2>
        <p className="font-body text-sm text-muted-foreground">{profiles?.length || 0} registered users</p>
      </div>
      <div className="space-y-2">
        {profiles?.map((profile) => {
          const roles = getUserRoles(profile.user_id);
          const isVip = (profile as any).is_vip;
          return (
            <div key={profile.id} className="border border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {profile.avatar_url ? <img src={profile.avatar_url} className="w-10 h-10 object-cover border border-border" /> : <div className="w-10 h-10 bg-muted flex items-center justify-center"><UserCog className="w-5 h-5 text-muted-foreground" /></div>}
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">{profile.display_name || "Unnamed"}</p>
                  <div className="flex gap-2 items-center mt-0.5">
                    {roles.map(r => <span key={r.id} className="bg-secondary text-secondary-foreground px-2 py-0.5 font-heading text-[9px] font-bold uppercase">{r.role}</span>)}
                    {isVip && <span className="bg-primary/10 text-primary px-2 py-0.5 font-heading text-[9px] font-bold">VIP</span>}
                    <span className="font-body text-[10px] text-muted-foreground">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggleVip.mutate({ userId: profile.user_id, isVip })}
                className={`px-4 py-2 font-heading text-xs font-bold uppercase transition-colors ${isVip ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-primary hover:border-primary"}`}
              >
                <Crown className="w-3 h-3 inline mr-1" /> {isVip ? "VIP ✓" : "GRANT VIP"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Announcements Manager ──
const AnnouncementsManager = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "", type: "info", is_active: true });
  const { data: announcements } = useQuery({ queryKey: ["admin-announcements"], queryFn: async () => { const { data, error } = await (supabase as any).from("announcements").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as any[]; } });
  const saveMutation = useMutation({ mutationFn: async (data: any) => { if (data.id) { const { error } = await (supabase as any).from("announcements").update(data).eq("id", data.id); if (error) throw error; } else { const { error } = await (supabase as any).from("announcements").insert(data); if (error) throw error; } }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-announcements"] }); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("announcements").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-announcements"] }) });
  const resetForm = () => { setEditing(null); setForm({ title: "", message: "", type: "info", is_active: true }); };
  const startEdit = (a: any) => { setEditing(a.id); setForm({ title: a.title, message: a.message, type: a.type, is_active: a.is_active }); };
  const toggleActive = useMutation({ mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => { const { error } = await (supabase as any).from("announcements").update({ is_active: !is_active }).eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-announcements"] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">MANAGE ANNOUNCEMENTS</h2>
        {!editing && <button onClick={() => setEditing("new")} className={btnPrimary}><Plus className="w-4 h-4" /> ADD BANNER</button>}
      </div>
      {editing && (
        <div className="border border-border p-6 mb-8 space-y-4">
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className={inputClass} />
          <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Message" rows={3} className={inputClass + " resize-none"} />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inputClass}>
            <option value="info">ℹ️ Info</option>
            <option value="warning">⚠️ Warning</option>
            <option value="success">✅ Success</option>
            <option value="event">📢 Event</option>
          </select>
          <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-primary" /> Active (visible on site)
          </label>
          <div className="flex gap-3">
            <button onClick={() => saveMutation.mutate(editing === "new" ? form : { ...form, id: editing })} className={btnPrimary}><Save className="w-4 h-4" /> SAVE</button>
            <button onClick={resetForm} className={btnSecondary}><X className="w-4 h-4" /> CANCEL</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {announcements?.map((ann: any) => (
          <div key={ann.id} className="border border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Megaphone className={`w-5 h-5 ${ann.is_active ? "text-primary" : "text-muted-foreground"}`} />
              <div>
                <p className="font-heading text-sm font-bold text-foreground">{ann.title} <span className={`text-[10px] ${ann.is_active ? "text-green-400" : "text-muted-foreground"}`}>{ann.is_active ? "● ACTIVE" : "○ INACTIVE"}</span></p>
                <p className="font-body text-xs text-muted-foreground line-clamp-1">{ann.message}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive.mutate({ id: ann.id, is_active: ann.is_active })} className="p-2 text-muted-foreground hover:text-primary" title="Toggle active">
                {ann.is_active ? <span className="text-xs font-heading font-bold text-green-400">ON</span> : <span className="text-xs font-heading font-bold">OFF</span>}
              </button>
              <button onClick={() => startEdit(ann)} className="p-2 text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
              <button onClick={() => deleteMutation.mutate(ann.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Messages Manager ──
const MessagesManager = () => {
  const queryClient = useQueryClient();
  const { data: messages } = useQuery({ queryKey: ["admin-messages"], queryFn: async () => { const { data, error } = await (supabase as any).from("contact_messages").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as any[]; } });
  const deleteMutation = useMutation({ mutationFn: async (id: string) => { const { error } = await (supabase as any).from("contact_messages").delete().eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }) });
  const toggleRead = useMutation({ mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => { const { error } = await (supabase as any).from("contact_messages").update({ is_read: !is_read }).eq("id", id); if (error) throw error; }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-black text-foreground">CONTACT MESSAGES</h2>
        <p className="font-body text-sm text-muted-foreground">{messages?.filter((m: any) => !m.is_read).length || 0} unread</p>
      </div>
      <div className="space-y-2">
        {messages?.map((msg: any) => (
          <div key={msg.id} className={`border p-4 ${msg.is_read ? "border-border" : "border-primary/30 bg-primary/5"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading text-sm font-bold text-foreground">{msg.name}</span>
                  <span className="flex items-center gap-1 font-body text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {msg.email}</span>
                  <span className="font-body text-[10px] text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <p className="font-heading text-xs font-bold text-primary mb-1">{msg.subject}</p>
                <p className="font-body text-sm text-muted-foreground">{msg.message}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleRead.mutate({ id: msg.id, is_read: msg.is_read })} className="p-2 text-muted-foreground hover:text-primary" title={msg.is_read ? "Mark unread" : "Mark read"}>
                  <span className="text-xs font-heading font-bold">{msg.is_read ? "READ" : "NEW"}</span>
                </button>
                <button onClick={() => deleteMutation.mutate(msg.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <div className="border border-border p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-heading text-lg text-muted-foreground">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Settings Manager ──
const SettingsManager = () => {
  const queryClient = useQueryClient();
  const [serverName, setServerName] = useState("Urban Legends");
  const [discordLink, setDiscordLink] = useState("https://discord.gg/urbanlegends");
  const [connectUrl, setConnectUrl] = useState("fivem://connect/jjl3am");
  const [saved, setSaved] = useState(false);

  const { data: settings } = useQuery({ queryKey: ["admin-settings"], queryFn: async () => { const { data, error } = await supabase.from("site_settings").select("*"); if (error) throw error; return data; } });

  useEffect(() => {
    if (settings) {
      settings.forEach((s) => {
        const val = s.value as any;
        if (s.key === "server_name" && val?.value) setServerName(val.value);
        if (s.key === "discord_link" && val?.value) setDiscordLink(val.value);
        if (s.key === "connect_url" && val?.value) setConnectUrl(val.value);
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const entries = [
        { key: "server_name", value: { value: serverName } },
        { key: "discord_link", value: { value: discordLink } },
        { key: "connect_url", value: { value: connectUrl } },
      ];
      for (const entry of entries) {
        await supabase.from("site_settings").upsert({ key: entry.key, value: entry.value, updated_at: new Date().toISOString() });
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-settings"] }); setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  return (
    <div>
      <h2 className="font-heading text-2xl font-black text-foreground mb-8">SITE SETTINGS</h2>
      <div className="max-w-lg space-y-4">
        <div><label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Server Name</label><input value={serverName} onChange={(e) => setServerName(e.target.value)} className={inputClass} /></div>
        <div><label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Discord Link</label><input value={discordLink} onChange={(e) => setDiscordLink(e.target.value)} className={inputClass} /></div>
        <div><label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">FiveM Connect URL</label><input value={connectUrl} onChange={(e) => setConnectUrl(e.target.value)} className={inputClass} /></div>
        <button onClick={() => saveMutation.mutate()} className={btnPrimary}><Save className="w-4 h-4" /> {saved ? "SAVED ✓" : "SAVE SETTINGS"}</button>
      </div>
    </div>
  );
};

export default Admin;
