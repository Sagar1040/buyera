"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/users", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (filterRole !== "ALL") url.searchParams.set("role", filterRole);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (
      !confirm(
        `Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`
      )
    )
      return;

    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setSuccessMsg(`User access role updated to ${newRole}.`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Failed to update role:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            USER DIRECTORY & ACCESS CONTROL
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Patrons & Staff Directory
          </h1>
        </div>

        <Button
          onClick={fetchUsers}
          variant="outline"
          size="sm"
          className="text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Directory
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-white border border-canvas-border p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by User Name, Email, or Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-canvas-border focus:outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="text-xs">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal/60 uppercase text-[10px] font-semibold">
            Role:
          </span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-canvas-border px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-gold"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers Only</option>
            <option value="ADMIN">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Patron</th>
                <th className="py-3.5 px-4">Email & Phone</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Role Privileges</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-cream-50 transition-colors">
                    {/* Name with Avatar Initials */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-charcoal text-[#E5D7B7] font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name ? u.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">{u.name}</p>
                          <p className="text-[10px] text-charcoal/50 font-mono">
                            ID: {u.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3.5 px-4">
                      <p className="text-charcoal flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gold-dark" />
                        {u.email}
                      </p>
                      <p className="text-charcoal/60 text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-charcoal/40" />
                        {u.phone}
                      </p>
                    </td>

                    {/* Orders Count */}
                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-100 border border-canvas-border text-[10px] font-semibold">
                        <ShoppingBag className="w-3 h-3 text-gold-dark" />
                        {u.ordersCount || 0} Orders
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold border ${
                          u.role === "ADMIN"
                            ? "bg-charcoal text-[#E5D7B7] border-black"
                            : "bg-cream-100 text-charcoal border-canvas-border"
                        }`}
                      >
                        {u.role === "ADMIN" ? (
                          <ShieldCheck className="w-3 h-3 text-gold" />
                        ) : (
                          <UserCheck className="w-3 h-3 text-charcoal/50" />
                        )}
                        {u.role}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Role Action Switcher */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        disabled={updatingId === u.id}
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                          u.role === "ADMIN"
                            ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                            : "bg-cream-100 text-charcoal border-canvas-border hover:border-gold"
                        }`}
                      >
                        {u.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
