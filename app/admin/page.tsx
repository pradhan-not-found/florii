import type { Metadata } from "next";
import { isSignedIn } from "./session";

export const metadata: Metadata = { title: "Payments", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Payment = {
  id: string; amount: number; currency: string; status: string; method?: string; email?: string;
  created_at: number; notes?: Record<string, string> | unknown[];
};

const logo = <svg viewBox="0 0 70 30" width="84" height="36" fill="none" stroke="currentColor" strokeWidth="3.7" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="florii">
  <path d="M10 26V10C10 5.5 12.8 3 17 4.2" /><path d="M5.5 14H15" /><path d="M22 4V22C22 25 23.8 26.2 26.2 25.2" />
  <path d="M33 14C29.2 14 27 16.8 27 20.2C27 23.8 29.6 26 33 26C36.8 26 39 23.2 39 19.8C39 16.2 36.4 14 33 14Z" />
  <path d="M45 14.5V26" /><path d="M45 19.5C46.2 15.6 49 14 52.4 15" /><path d="M57.5 15V26" /><path d="M64.5 15V26" />
  <circle cx="57.5" cy="8.2" r="0.6" /><circle cx="64.5" cy="8.2" r="0.6" />
</svg>;

async function fetchPayments(): Promise<{ payments: Payment[]; error?: string }> {
  const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return { payments: [], error: "Razorpay keys aren't set yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." };
  const response = await fetch("https://api.razorpay.com/v1/payments?count=100", {
    headers: { Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64") },
    cache: "no-store",
  });
  if (!response.ok) return { payments: [], error: "Couldn't reach Razorpay. Check the keys and try again." };
  const data = await response.json() as { items?: Payment[] };
  return { payments: data.items ?? [] };
}

const money = (amount: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
const note = (payment: Payment, key: string) => (payment.notes && !Array.isArray(payment.notes) ? payment.notes[key] ?? "" : "");

function SignIn({ error }: { error?: string }) {
  return <main className="admin-page">
    <form className="admin-signin" method="post" action="/api/admin/login">
      <span className="admin-logo">{logo}</span>
      <h1>payments</h1>
      <p>sign in to see who has sponsored florii.</p>
      {error === "wrong" && <p className="pay-error" role="alert">That password isn&apos;t right.</p>}
      {error === "setup" && <p className="pay-error" role="alert">Set ADMIN_PASSWORD in your environment variables first.</p>}
      <label className="pay-fields"><span className="pay-label">password</span><input type="password" name="password" required autoComplete="current-password" autoFocus /></label>
      <button className="btn btn-dark pay-go" type="submit">sign in</button>
    </form>
  </main>;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await isSignedIn())) return <SignIn error={(await searchParams).error} />;

  const { payments, error } = await fetchPayments();
  const captured = payments.filter(p => p.status === "captured");
  const totals = captured.reduce<Record<string, number>>((sum, p) => { sum[p.currency] = (sum[p.currency] || 0) + p.amount; return sum; }, {});

  return <main className="admin-page">
    <header className="admin-head">
      <span className="admin-logo">{logo}</span>
      <form method="post" action="/api/admin/logout"><button className="btn btn-ghost" type="submit">sign out</button></form>
    </header>
    <h1>payments</h1>

    <section className="admin-stats">
      <div><span>received</span><strong>{Object.entries(totals).map(([currency, amount]) => money(amount, currency)).join(" · ") || "—"}</strong></div>
      <div><span>successful payments</span><strong>{captured.length}</strong></div>
      <div><span>failed or pending</span><strong>{payments.length - captured.length}</strong></div>
    </section>

    {error && <p className="pay-error" role="alert">{error}</p>}

    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>date</th><th>product</th><th>link</th><th>email</th><th>amount</th><th>status</th><th>payment id</th></tr></thead>
        <tbody>
          {payments.length === 0 && !error && <tr><td colSpan={7} className="admin-empty">no payments yet. they&apos;ll appear here as sponsors check out.</td></tr>}
          {payments.map(p => <tr key={p.id}>
            <td>{new Date(p.created_at * 1000).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
            <td>{note(p, "product") || "—"}{note(p, "description") && <small>{note(p, "description")}</small>}</td>
            <td>{note(p, "link") ? <a href={note(p, "link").startsWith("http") ? note(p, "link") : "https://" + note(p, "link")} target="_blank" rel="noreferrer">{note(p, "link")}</a> : "—"}</td>
            <td>{note(p, "email") || p.email || "—"}</td>
            <td className="admin-amount">{money(p.amount, p.currency)}</td>
            <td><span className={"admin-status admin-" + p.status}>{p.status}</span></td>
            <td><code>{p.id}</code></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <p className="admin-note">showing the latest 100 payments from Razorpay. refunds and payouts are managed in the Razorpay dashboard.</p>
  </main>;
}
