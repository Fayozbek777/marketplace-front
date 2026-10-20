import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  X,
  Home,
  Receipt,
  Sparkles,
} from "lucide-react";

interface Props {
  open: boolean;
  status: "success" | "failed" | null;
  onClose: () => void;
  /** Сумма (опционально) — покажем в деталях */
  amount?: number;
  /** Название тарифа (опционально) */
  planName?: string;
  /** ID объявления — для ссылки «к объявлению» */
  listingId?: string;
}

export function PaymentModal({
  open,
  status,
  onClose,
  amount,
  planName,
  listingId,
}: Props) {
  const navigate = useNavigate();
  const success = status === "success";

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Блокировка скролла фона
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const goHome = () => {
    onClose();
    navigate("/");
  };

  const goToListing = () => {
    if (!listingId) return;
    onClose();
    navigate(`/listings/${listingId}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка X в углу */}
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute top-3 right-3 w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Декоративный фон */}
            <div
              className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-40 ${
                success ? "bg-emerald-200" : "bg-red-200"
              }`}
            />

            {/* Иконка с пульсацией */}
            <div className="relative mx-auto w-20 h-20 mb-5">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.15, 1], opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                }}
                className={`absolute inset-0 rounded-full ${
                  success ? "bg-emerald-100" : "bg-red-100"
                }`}
              />
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                  delay: 0.1,
                }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                  success
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {success ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <XCircle className="w-10 h-10" />
                )}
              </motion.div>
            </div>

            {/* Заголовок */}
            <h2 className="text-2xl font-bold text-gray-900">
              {success ? "Оплата прошла!" : "Платёж отклонён"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {success
                ? "Объявление продвигается. Спасибо, что выбрали нас!"
                : "Не удалось списать средства. Попробуйте другую карту."}
            </p>

            {/* Детали платежа */}
            {(amount !== undefined || planName) && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left text-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wide mb-2">
                  <Receipt className="w-3.5 h-3.5" />
                  Детали
                </div>
                {planName && (
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-gray-600">Тариф</span>
                    <span className="font-medium text-gray-900">
                      {planName}
                    </span>
                  </div>
                )}
                {amount !== undefined && (
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-gray-600">Сумма</span>
                    <span className="font-bold text-gray-900">
                      {amount.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200 text-xs text-emerald-700">
                    <Sparkles className="w-3 h-3" />
                    Объявление активировано
                  </div>
                )}
              </div>
            )}

            {/* Кнопки */}
            <div className="mt-6 space-y-2">
              {success && listingId ? (
                <button
                  onClick={goToListing}
                  className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition"
                >
                  К объявлению
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition"
                >
                  {success ? "Отлично" : "Закрыть"}
                </button>
              )}

              <button
                onClick={goHome}
                className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-xl font-medium transition inline-flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                На главную
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
