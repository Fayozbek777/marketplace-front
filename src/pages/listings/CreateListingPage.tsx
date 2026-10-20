import { ListingForm } from "@/features/listings";

export default function CreateListingPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Новое объявление</h1>
      <ListingForm />
    </div>
  );
}
