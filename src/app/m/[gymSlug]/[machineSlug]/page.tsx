import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { MachineGuide } from "@/components/MachineGuide";
import { getMachineBySlug, incrementViews, localizeMachine } from "@/lib/machines";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ gymSlug: string; machineSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { gymSlug, machineSlug } = await params;
  const m = await getMachineBySlug(gymSlug, machineSlug);
  if (!m) return { title: "Machine not found" };
  return { title: `${m.nameEn} · ${m.gym.name}` };
}

export default async function SlugGuidePage({ params }: Props) {
  const { gymSlug, machineSlug } = await params;
  const m = await getMachineBySlug(gymSlug, machineSlug);
  if (!m) notFound();
  await incrementViews(m.id);
  const refreshed = { ...m, viewCount: m.viewCount + 1 };

  return (
    <>
      <SiteHeader compact />
      <main className="flex-1">
        <MachineGuide
          gymName={m.gym.name}
          gymColor={m.gym.primaryColor}
          token={m.token}
          en={localizeMachine(refreshed, "en")}
          fr={localizeMachine(refreshed, "fr")}
        />
      </main>
    </>
  );
}
