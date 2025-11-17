import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "TBM Collective",
  description: "Stake time, earn TBM tokens, and collaborate via Supabase"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}

