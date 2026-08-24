import { notFound } from "next/navigation";
import { getTripById } from "@/app/lib/data/trips";
import TripForm from "../../TripForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTripPage({ params }: PageProps) {
  const { id } = await params;
  const trip = await getTripById(id);
  if (!trip) notFound();
  return <TripForm mode="edit" initial={trip} />;
}
