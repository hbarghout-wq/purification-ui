"use client";
import { useState } from "react";

type Ok = {
  ticker: string; gain: number; purification_ratio: number; purification_amount: number;
  source?: { provider: string; report_date?: string };
  audit?: { calculation_id?: string };
};
type Err = { error: string; message?: string };
type Result = Ok | Err;

export default function Calc() {
  const [ticker, setTicker] = useState("AMZN");
  const [invested, setInvested] = useState("10000");
  const [proceeds, setProceeds] = useState("12000");
  const [loading, setLoading] = useState(false);
  const [resObj, setResObj] = useState<Result | null>(null);
  const base = process.env.NEXT_PUBLIC_API_BASE!;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setResObj(null);
    try {
      const r = await fetch(`${base}/calc/capital-gain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: ticker.trim().toUpperCase(),
          invested_amount: Number(invested),
          sale_proceeds: Number(proceeds),
        }),
      });
      setResObj(await r.json());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setResObj({ error: "NETWORK_ERROR", message: msg });
    } finally { setLoading(false); }
  }

  return (
    <main style={{maxWidth:720,margin:"2rem auto",padding:"1rem"}}>
      <h1>Capital Gain Purification</h1>
      <form onSubmit={onSubmit} style={{display:"grid",gap:"0.75rem",marginTop:"1rem"}}>
        <label> Ticker
          <input value={ticker} onChange={e=>setTicker(e.target.value)} required />
        </label>
        <label> Invested Amount
          <input type="number" step="0.01" value={invested} onChange={e=>setInvested(e.target.value)} required />
        </label>
        <label> Sale Proceeds
          <input type="number" step="0.01" value={proceeds} onChange={e=>setProceeds(e.target.value)} required />
        </label>
        <button disabled={loading}>{loading ? "Calculating..." : "Calculate"}</button>
      </form>

      {resObj && (
        <div style={{border:"1px solid #ddd",padding:"1rem",marginTop:"1rem"}}>
          {"error" in resObj ? (
            <>
              <div><b>Error:</b> {resObj.error}</div>
              {resObj.message && <div style={{color:"#666"}}>{resObj.message}</div>}
            </>
          ) : (
            <>
              <div><b>Ticker:</b> {resObj.ticker}</div>
              <div><b>Gain:</b> {resObj.gain}</div>
              <div><b>Purification Ratio:</b> {resObj.purification_ratio}</div>
              <div><b>Purification Amount:</b> {resObj.purification_amount}</div>
              {resObj.source && <div style={{color:"#666"}}>
                Source: {resObj.source.provider}{resObj.source.report_date ? ` (${resObj.source.report_date})` : ""}
              </div>}
              {resObj.audit?.calculation_id && <div style={{color:"#999",fontSize:"0.9em"}}>
                Calc ID: {resObj.audit.calculation_id}
              </div>}
            </>
          )}
        </div>
      )}
    </main>
  );
}
