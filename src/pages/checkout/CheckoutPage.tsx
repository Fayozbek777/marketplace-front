import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Rocket, ChevronLeft } from "lucide-react";
import { CheckoutForm, PaymentModal } from "@/features/checkout";

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "failed" | null>(null);

  if (!id) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">Объявление не найдено</p>
          <Link
            to="/listings"
            className="mt-4 inline-block px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition"
          >
            К объявлениям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Хлебные крошки */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link to={`/listings/${id}`} className="hover:text-brand-600">
          К объявлению
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900">Продвижение</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">
              Продвижение объявления
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Выберите тариф — объявление поднимется в ленте и получит больше
            просмотров
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Назад
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <CheckoutForm
          listingId={id}
          onSuccess={(s) => {
            setStatus(s);
            setModalOpen(true);
          }}
        />
      </div>

      <PaymentModal
        open={modalOpen}
        status={status}
        onClose={() => setModalOpen(false)}
        listingId={id}
      />
    </div>
  );
}
