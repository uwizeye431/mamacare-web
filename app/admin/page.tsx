"use client"

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BarChart3, Inbox, Loader2, ShieldCheck, Users } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import StatsOverview from "../../components/admin/StatsOverview";
import UsersPanel from "../../components/admin/UsersPanel";
import MessagesPanel from "../../components/admin/MessagesPanel";

const subscribeNoop = () => () => {};

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "messages", label: "Messages", icon: Inbox },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  // The login state lives in localStorage: only read it in the browser
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [tab, setTab] = useState<Tab>("overview");

  if (!isClient) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-label="Loading" />
      </main>
    );
  }

  // The API enforces admin access on every request; this only avoids showing an empty shell
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="min-h-[70vh] flex items-center justify-center bg-background px-4 pt-24">
        <div className="max-w-md text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-black text-foreground mb-2">Admins only</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isAuthenticated ? "Your account does not have admin access." : "Please log in with an admin account."}
          </p>
          <Link href={isAuthenticated ? "/" : "/login"} className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold">
            {isAuthenticated ? "Go home" : "Log in"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-1">Admin</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage MamaCare users and messages.</p>

        <div role="tablist" aria-label="Admin sections" className="flex gap-2 mb-8 border-b border-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-sm font-bold transition-colors ${
                tab === id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" /> {label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === "overview" && <StatsOverview onOpenMessages={() => setTab("messages")} />}
          {tab === "users" && <UsersPanel currentUserId={user.id} />}
          {tab === "messages" && <MessagesPanel />}
        </div>
      </div>
    </main>
  );
}
