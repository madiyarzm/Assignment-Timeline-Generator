"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { c } from "@/lib/style";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fake "success" then route change:
    router.push("/dashboard");
  }

  return (
    <div style={c.page.style}>
      <div style={c.card.style}>
        <h1 style={c.h1.style}>Register</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={c.input.style}
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={c.input.style}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={c.input.style}
          />
          <button type="submit" style={c.buttonPrimary.style}>
            Create account
          </button>
        </form>
        <p style={{ ...c.muted.style, marginTop: 16 }}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}

