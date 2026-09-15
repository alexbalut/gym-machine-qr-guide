import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QrScanner } from "@/components/QrScanner";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scan a machine",
};

export default async function ScanPage() {
  const gym = await prisma.gym.findFirst({
    include: {
      machines: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        take: 12,
      },
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-8 flex-1 w-full">
        <h1 className="text-3xl font-bold mb-2">Scan machine QR</h1>
        <p className="text-slate-400 mb-6">
          Use your camera, or pick a demo machine below if you&apos;re testing without a printed code.
        </p>
        <QrScanner />

        {gym && gym.machines.length > 0 && (
          <section className="mt-8">
            <h2 className="font-semibold mb-3 text-slate-300">Demo machines — {gym.name}</h2>
            <ul className="space-y-2">
              {gym.machines.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/q/${m.token}`}
                    className="card px-4 py-3 flex items-center justify-between hover:border-cyan-400/40 transition"
                  >
                    <span>
                      <span className="font-medium">{m.nameEn}</span>
                      <span className="text-slate-500 text-sm"> · {m.nameFr}</span>
                    </span>
                    <span className="badge">{m.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
