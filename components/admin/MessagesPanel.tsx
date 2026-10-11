"use client"

import { useEffect, useState } from "react";
import { Loader2, Mail, Phone } from "lucide-react";
import { adminApi, formatDate } from "./adminApi";

interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

interface MessageList {
  messages: ContactMessage[];
  total: number;
  page: number;
  pageSize: number;
}

const button = "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50";

export default function MessagesPanel() {
  const [filter, setFilter] = useState<"unread" | "all">("unread");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MessageList | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminApi<MessageList>(`/messages?status=${filter}&page=${page}`)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [filter, page, reloadKey]);

  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setError("");
    try {
      await action();
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setBusyId(null);
    }
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-4">
      <div className="flex gap-2" role="group" aria-label="Show">
        {(["unread", "all"] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-bold ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}
          >
            {f === "unread" ? "Unread" : "All messages"}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}

      {!data ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading" />
      ) : data.messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {filter === "unread" ? "No unread messages." : "No messages yet."}
        </p>
      ) : (
        <ul className="space-y-3">
          {data.messages.map((m) => {
            const busy = busyId === m.id;
            return (
              <li key={m.id} className={`rounded-2xl border bg-card p-5 ${m.read_at ? "border-border" : "border-primary/40"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-black text-foreground">
                      {!m.read_at && <span className="mr-2 inline-block rounded-full bg-primary px-2 py-0.5 align-middle text-[10px] font-bold uppercase text-primary-foreground">New</span>}
                      {m.subject}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {m.full_name} · {formatDate(m.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {busy && <Loader2 className="w-4 h-4 animate-spin text-primary self-center" aria-label="Working" />}
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                      className={`${button} border-border text-foreground hover:bg-muted inline-flex items-center gap-1`}
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Reply
                    </a>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(m.id, () => adminApi(`/messages/${m.id}`, { method: "PATCH", body: { read: !m.read_at } }))}
                      className={`${button} border-border text-foreground hover:bg-muted`}
                    >
                      {m.read_at ? "Mark unread" : "Mark read"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (window.confirm("Delete this message permanently?")) {
                          run(m.id, () => adminApi(`/messages/${m.id}`, { method: "DELETE" }));
                        }
                      }}
                      className={`${button} border-destructive/30 text-destructive hover:bg-destructive/10`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{m.message}</p>
                <p className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" aria-hidden="true" /> {m.email}</span>
                  {m.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" aria-hidden="true" /> {m.phone}</span>}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-end gap-2 text-sm">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={`${button} border-border`}>Previous</button>
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className={`${button} border-border`}>Next</button>
        </nav>
      )}
    </div>
  );
}
