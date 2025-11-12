"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <section>
      <h1>ATG — Landing</h1>
      <p>Turn big assignments into clear timelines.</p>
      <button onClick={() => router.push("/register")}>Get started</button>
    </section>
  );
}

