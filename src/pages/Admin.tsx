import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/** ---------- Types ---------- */
type Category = "hiking" | "cycling" | "nature";
type Difficulty = "Easy" | "Moderate" | "Challenging";

type Tour = {
  id: string;
  title: string;
  category: Category;
  shortDescription: string;
  longDescription: string;
  durationDays: number;
  location: string;
  nextStartDate: string; // ISO (YYYY-MM-DD)
  availableSlots: number;
  priceGBP: number;
  images: string[];
  rating: number; // 0..5
  difficulty: Difficulty;
};

type RentalItem = {
  id: string;
  title: string;
  brand?: string;
  category: string;
  dailyGBP: number;
  depositGBP: number;
  stock: number;
  images: string[];
  rating: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "suspended";
  lastSeenISO: string;
};

type Auth = { name: string; email: string; role: "admin" | "editor" | "viewer" };

/** ---------- Utils ---------- */
const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now()}`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** ---------- Reusable bits ---------- */
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <h2 className="text-xl font-extrabold bg-gradient-to-r from-emerald-700 via-emerald-600 to-indigo-600 bg-clip-text text-transparent">
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-neutral-600">{subtitle}</p>}
    </header>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border px-3 py-2 outline-none transition",
        "border-emerald-300 bg-white/90 placeholder-neutral-500 focus:border-emerald-500",
        props.className || ""
      )}
    />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
      {children}
    </span>
  );
}

/** ---------- Page ---------- */
export default function Admin() {
  const [stats, setStats] = useState({ tours: 0, rentals: 0, users: 0 });

  useEffect(() => {
    const tours = load<Tour[]>("custom_tours", []).length;
    const rentals = load<RentalItem[]>("rental_items", []).length;
    const users = load<AdminUser[]>("admin_users", seedUsers()).length;
    setStats({ tours, rentals, users });
  }, []);

  return (
    <div className="space-y-8 px-4 sm:px-6">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-indigo-600 p-6 text-white ring-1 ring-black/10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-emerald-50">Quick actions on the left. Manage users in the main panel.</p>

          {/* Tiny stats */}
          <dl className="mt-4 grid grid-cols-3 gap-3 max-w-md">
            <div className="rounded-xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/20">
              <dt className="text-xs text-emerald-50">Tours</dt>
              <dd className="text-lg font-extrabold">{stats.tours}</dd>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/20">
              <dt className="text-xs text-emerald-50">Rentals</dt>
              <dd className="text-lg font-extrabold">{stats.rentals}</dd>
            </div>
            <div className="rounded-xl bg-white/10 px-3 py-3 text-center ring-1 ring-white/20">
              <dt className="text-xs text-emerald-50">Users</dt>
              <dd className="text-lg font-extrabold">{stats.users}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">
        {/* LEFT SIDEBAR (Quick actions) */}
        <aside className="lg:col-span-3 space-y-6">
          <QuickActions />
          <HelpCard />
        </aside>

        {/* MAIN (User management) */}
        <main className="lg:col-span-9">
          <UserManagement />
        </main>
      </div>
    </div>
  );
}

/** ---------- Left: Quick Actions ---------- */
function QuickActions() {
  const nav = useNavigate();

  function logout() {
    try {
      localStorage.removeItem("admin_auth");
    } catch {}
    alert("Logged out (demo). Redirecting to login.");
    nav("/login");
  }

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
      <SectionTitle title="Quick actions" />
      <div className="grid gap-3">
        <button
          onClick={logout}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-700"
        >
          {/* logout icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Log out
        </button>

        <Link
          to="/admin/create/tour"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
          title="Go to the tour composer page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Post Tour
        </Link>

        <Link
          to="/admin/create/rental"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-700"
          title="Go to the rental composer page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Post Rental
        </Link>

        <Link
          to="/tours"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 font-semibold text-emerald-700 ring-1 ring-emerald-300 transition hover:bg-emerald-50"
        >
          View site → Tours
        </Link>
        <Link
          to="/rentals"
          className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 font-semibold text-indigo-700 ring-1 ring-indigo-300 transition hover:bg-indigo-50"
        >
          View site → Rentals
        </Link>
      </div>
    </section>
  );
}

function HelpCard() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-indigo-50 p-5 ring-1 ring-emerald-200">
      <p className="text-sm text-neutral-700">
        <strong>Heads up:</strong> This demo uses <code>localStorage</code>. The “Post Tour” and “Post Rental” links
        assume you’ll add composer pages later.
      </p>
    </section>
  );
}

/** ---------- Main: User Management (no filters; admin-only editing) ---------- */
function seedUsers(): AdminUser[] {
  return [
    {
      id: uid("usr"),
      name: "Alex Morgan",
      email: "alex@example.com",
      role: "admin",
      status: "active",
      lastSeenISO: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: uid("usr"),
      name: "Samir Patel",
      email: "samir@example.com",
      role: "editor",
      status: "active",
      lastSeenISO: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: uid("usr"),
      name: "Maya Chen",
      email: "maya@example.com",
      role: "viewer",
      status: "suspended",
      lastSeenISO: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(() => load<AdminUser[]>("admin_users", seedUsers()));
  const me = load<Auth>("admin_auth", { name: "Demo Admin", email: "admin@example.com", role: "admin" });
  const isAdmin = me.role === "admin";

  useEffect(() => save("admin_users", users), [users]);

  // No filters: just sort by name for stable display
  const list = useMemo(() => [...users].sort((a, b) => a.name.localeCompare(b.name)), [users]);

  function modify(u: AdminUser) {
    if (!isAdmin) return alert("Only admins can modify users.");
    const name = prompt("Edit name:", u.name);
    if (name === null) return;
    const email = prompt("Edit email:", u.email);
    if (email === null) return;
    // Keep role/status unchanged in this simplified editor
    updateUser(u.id, { name: name.trim(), email: email.trim() });
  }

  function remove(u: AdminUser) {
    if (!isAdmin) return alert("Only admins can delete users.");
    if (!confirm(`Delete ${u.name}?`)) return;
    setUsers(prev => prev.filter(x => x.id !== u.id));
  }

  function invite() {
    if (!isAdmin) return alert("Only admins can invite users.");
    const name = prompt("New user name:");
    if (!name) return;
    const email = prompt("Email:");
    if (!email) return;
    const u: AdminUser = {
      id: uid("usr"),
      name: name.trim(),
      email: email.trim(),
      role: "viewer", // default minimal permissions
      status: "active",
      lastSeenISO: new Date().toISOString(),
    };
    setUsers(prev => [u, ...prev]);
  }

  function updateUser(id: string, patch: Partial<AdminUser>) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
  }

  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
      <SectionTitle title="User management" subtitle="Only admins can modify or delete users." />

      <div className="mt-0 flex flex-wrap gap-2">
        <button
          onClick={invite}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
          disabled={!isAdmin}
          title={isAdmin ? "Invite a new user" : "Admin only"}
        >
          Invite user
        </button>
        <Link
          to="/settings"
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-300 transition hover:bg-emerald-50"
        >
          Admin settings
        </Link>
      </div>

      {/* Table (no filters, minimal actions) */}
      <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-emerald-200">
        <table className="min-w-full divide-y divide-emerald-100">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-700">User</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-700">Role</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-700">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-700">Last seen</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-neutral-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100 bg-white">
            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-neutral-600">
                  No users yet.
                </td>
              </tr>
            )}
            {list.map((u) => (
              <tr key={u.id} className="hover:bg-emerald-50/40">
                {/* Profile column */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-neutral-900">{u.name}</p>
                  <p className="text-xs text-neutral-600">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Chip>{u.role}</Chip>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                      u.status === "active"
                        ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20"
                        : "bg-amber-100 text-amber-800 ring-1 ring-amber-600/20"
                    )}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-700">
                  {new Date(u.lastSeenISO).toLocaleString()}
                </td>

                {/* Actions: ONLY Modify & Delete */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => modify(u)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                      disabled={!isAdmin}
                      title={isAdmin ? "Modify user (name/email)" : "Admin only"}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => remove(u)}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      disabled={!isAdmin}
                      title={isAdmin ? "Delete user" : "Admin only"}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
