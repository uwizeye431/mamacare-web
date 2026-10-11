"use client"

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import { adminApi, formatDate } from "./adminApi";

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  is_verified: boolean;
  disabled_at: string | null;
  created_at: string;
}

interface UserList {
  users: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

const button = "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors disabled:opacity-50";

export default function UsersPanel({ currentUserId }: { currentUserId: string }) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({ search: "", page: 1 });
  const [data, setData] = useState<UserList | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(query.page) });
    if (query.search) params.set("search", query.search);
    adminApi<UserList>(`/users?${params}`)
      .then((result) => !cancelled && setData(result))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [query, reloadKey]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setQuery({ search: search.trim(), page: 1 });
  };

  const run = async (user: AdminUser, action: () => Promise<unknown>) => {
    setBusyId(user.id);
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

  const update = (user: AdminUser, body: { role?: string; disabled?: boolean }) =>
    run(user, () => adminApi(`/users/${user.id}`, { method: "PATCH", body }));

  const remove = (user: AdminUser) => {
    const label = user.email ?? user.name;
    if (!window.confirm(`Permanently delete ${label} and all of their health records? This cannot be undone.`)) return;
    run(user, () => adminApi(`/users/${user.id}`, { method: "DELETE" }));
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="space-y-4">
      <form onSubmit={submitSearch} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input
            id="user-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90">
          Search
        </button>
      </form>

      {error && <p role="alert" className="text-sm font-semibold text-destructive">{error}</p>}

      {!data ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="Loading" />
      ) : (
        <>
          <p className="text-xs text-muted-foreground">{data.total} user{data.total === 1 ? "" : "s"}</p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="p-3">Name</th>
                  <th scope="col" className="p-3">Contact</th>
                  <th scope="col" className="p-3">Status</th>
                  <th scope="col" className="p-3">Joined</th>
                  <th scope="col" className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.users.map((user) => {
                  const self = user.id === currentUserId;
                  const busy = busyId === user.id;
                  return (
                    <tr key={user.id} className={user.disabled_at ? "opacity-60" : ""}>
                      <td className="p-3 font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          {user.name}
                          {user.role === "admin" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase">
                              <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Admin
                            </span>
                          )}
                          {self && <span className="text-[10px] text-muted-foreground">(you)</span>}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        <div>{user.email ?? "—"}</div>
                        {user.phone && <div className="text-xs">{user.phone}</div>}
                      </td>
                      <td className="p-3 text-xs">
                        {user.disabled_at ? (
                          <span className="font-bold text-destructive">Deactivated</span>
                        ) : user.is_verified ? (
                          <span className="font-semibold text-foreground">Active</span>
                        ) : (
                          <span className="text-muted-foreground">Email not verified</span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(user.created_at)}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {busy && <Loader2 className="w-4 h-4 animate-spin text-primary self-center" aria-label="Working" />}
                          <button
                            type="button"
                            disabled={busy || self}
                            onClick={() => update(user, { role: user.role === "admin" ? "patient" : "admin" })}
                            className={`${button} border-border text-foreground hover:bg-muted`}
                          >
                            {user.role === "admin" ? "Remove admin" : "Make admin"}
                          </button>
                          <button
                            type="button"
                            disabled={busy || self}
                            onClick={() => update(user, { disabled: !user.disabled_at })}
                            className={`${button} border-border text-foreground hover:bg-muted`}
                          >
                            {user.disabled_at ? "Reactivate" : "Deactivate"}
                          </button>
                          <button
                            type="button"
                            disabled={busy || self}
                            onClick={() => remove(user)}
                            className={`${button} border-destructive/30 text-destructive hover:bg-destructive/10`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <nav aria-label="Pages" className="flex items-center justify-end gap-2 text-sm">
              <button type="button" disabled={query.page <= 1} onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))} className={`${button} border-border`}>
                Previous
              </button>
              <span className="text-muted-foreground">Page {query.page} of {pages}</span>
              <button type="button" disabled={query.page >= pages} onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))} className={`${button} border-border`}>
                Next
              </button>
            </nav>
          )}
          <p className="text-xs text-muted-foreground">
            Role changes and deactivations take effect within 15 minutes. Deleting a user removes their account, pregnancy
            profile, visits and symptom history permanently.
          </p>
        </>
      )}
    </div>
  );
}
