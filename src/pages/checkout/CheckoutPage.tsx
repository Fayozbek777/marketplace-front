import { useParams } from "react-router-dom";
import { useState } from "react";
import { CheckoutForm, PaymentModal } from "@/features/checkout";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);

  if (!id) return <div className="p-4">Объявление не найдено</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Продвижение объявления</h1>

      <CheckoutForm
        listingId={id}
        onSuccess={(s) => {
          setStatus(s);
          setModalOpen(true);
        }}
      />

      <PaymentModal
        open={modalOpen}
        status={status}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
