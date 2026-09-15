import { prisma } from "@/lib/prisma";
import { GymHome } from "@/components/GymHome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Demo Fitness Montréal",
  description: "Machine how-to guides — scan a QR or browse machines.",
};

export default async function HomePage() {
  const gym = await prisma.gym.findFirst({
    where: { slug: "demo-fitness-montreal" },
    include: {
      machines: {
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  // Fallback: any seeded gym if slug missing
  const resolved =
    gym ??
    (await prisma.gym.findFirst({
      include: {
        machines: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }));

  if (!resolved) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">No gym seeded</h1>
        <p className="text-slate-400 mb-6">
          Run <code className="text-cyan-300">npm run seed</code> to load Demo Fitness Montréal.
        </p>
        <a href="/admin/login" className="text-sm text-slate-500 hover:text-slate-300 underline">
          Staff login
        </a>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full flex flex-col">
      <GymHome
        gym={{
          name: resolved.name,
          tagline: resolved.tagline,
          city: resolved.city,
          primaryColor: resolved.primaryColor,
          slug: resolved.slug,
        }}
        machines={resolved.machines.map((m) => ({
          id: m.id,
          token: m.token,
          nameEn: m.nameEn,
          nameFr: m.nameFr,
          category: m.category,
          slug: m.slug,
        }))}
      />
    </main>
  );
}
