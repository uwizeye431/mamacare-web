"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone, Send, Clock, CheckCircle2, AlertCircle, HeartHandshake } from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send your message.");
      }

      setSuccessMessage(data.message || "Message sent successfully.");
      setForm(initialState);
    } catch (error: any) {
      setErrorMessage(error.message || "Unable to send your message right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-10 mb-8">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-4">
              <HeartHandshake className="w-4 h-4" />
              We are here for you
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Contact MamaCare</h1>
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Need help with your pregnancy profile, appointments, or reports? Send us a message and the care team will reply as soon as possible.
            </p>
          </div>
        </section>

        <div className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-5">Contact Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Email</p>
                  <p className="text-sm font-semibold text-foreground">uwizeyekevin43@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Phone</p>
                  <p className="text-sm font-semibold text-foreground">+250 788 775 937</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Address</p>
                  <p className="text-sm font-semibold text-foreground">Remera, Kigali City, Rwanda</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-border p-4">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-1">Support Hours</p>
                  <p className="text-sm font-semibold text-foreground">Mon - Sat, 08:00 - 20:00</p>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-2">Send Us a Message</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the form below and we will contact you soon.
            </p>

            {successMessage && (
              <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full name *"
                  required
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Email address *"
                  required
                />
              </div>

              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Phone number (optional)"
              />

              <input
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Subject *"
                required
              />

              <textarea
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Write your message here... *"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
