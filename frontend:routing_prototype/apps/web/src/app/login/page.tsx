"use client";
import { useRouter } from "next/navigation";
import { c } from "@/lib/style";

export default function LoginPage() {
  const router = useRouter();
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }
  return (
    <div style={c.page.style}>
      <div style={c.card.style}>
        <h1 style={c.h1.style}>Login</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
          <input placeholder="Email" type="email" required style={c.input.style} />
          <input placeholder="Password" type="password" required style={c.input.style} />
          <button type="submit" style={c.buttonPrimary.style}>Continue</button>
        </form>
      </div>
    </div>
  );
}

