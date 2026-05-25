import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, MessageSquare, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import asphaltBg from "@/assets/asphalt-texture.jpg";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { error: dbError } = await (supabase as any).from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });

    if (dbError) {
      setError("Failed to send message. Please try again.");
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${asphaltBg})`, backgroundSize: "cover" }} />
      <div className="absolute inset-0 bg-background/90" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-heading text-sm font-bold uppercase tracking-wider mb-12">
          <ArrowLeft className="w-4 h-4" /> BACK TO HOME
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl lg:text-6xl font-heading font-black text-foreground leading-none mb-4">
              CONTACT <span className="text-primary">US</span>
            </h1>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              Got a question or suggestion? Send us a message and we'll get back to you.
            </p>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-primary/30 bg-primary/5 p-12 text-center">
              <Send className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-heading text-xl font-black text-foreground mb-2">MESSAGE SENT!</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">Thank you for reaching out. We'll respond as soon as possible.</p>
              <button onClick={() => setSuccess(false)} className="bg-primary text-primary-foreground px-8 py-3 font-heading font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity">
                SEND ANOTHER
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-border p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    <User className="w-3 h-3 inline mr-1" /> Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    <Mail className="w-3 h-3 inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    required
                    maxLength={255}
                  />
                </div>
              </div>
              <div>
                <label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What's this about?"
                  className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  required
                  maxLength={200}
                />
              </div>
              <div>
                <label className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Write your message here..."
                  rows={6}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                  required
                  maxLength={2000}
                />
              </div>
              {error && <p className="font-body text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3 font-heading font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {submitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
