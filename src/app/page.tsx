"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Health = { ok?: boolean } | { error: string };

export default function Home() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE!;
    fetch(`${base}/health`, { cache: "no-store" })
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ error: "network_error" }));
  }, []);

  const status =
    !health ? "Checking..." :
    "error" in health ? "DOWN" :
    health.ok ? "OK" : "DOWN";

  return (
    <main style={{maxWidth:720,margin:"2rem auto",padding:"1rem"}}>
      <h1>Purification MVP</h1>
      <p>Status: <strong style={{color: status==="OK" ? "green":"crimson"}}>{status}</strong></p>
      <p><Link href="/calc">Go to Calculator →</Link></p>
    </main>
  );
}
