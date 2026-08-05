import type { Metadata } from "next";
import { MenuExperience } from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: "Menu | The Peachy",
  description: "Browse The Peachy's whole cakes, spoon cakes, bingsu, drinks, and bakery menu.",
};

export default async function MenuPage({ searchParams }: PageProps<"/menu">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";

  return <MenuExperience initialQuery={q} initialCategory={category} />;
}
