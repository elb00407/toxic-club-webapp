"use client";
import Header from "@/components/Header";
import WebAppShell from "@/components/WebAppShell";
import CategoryPicker from "@/components/CategoryPicker";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";

export default function Page() {
  const [pickedVip, setPickedVip] = useState<boolean | null>(null);

  return (
    <WebAppShell>
      <Header subtitle="Бронирование ПК" />
      <main className="px-4 py-3">
        {pickedVip === null && (
          <>
            <div className="text-sm mb-4" style={{ color: "#9aa0a6" }}>
              Выберите категорию для автоназначения ПК
            </div>
            <CategoryPicker onPick={(v) => setPickedVip(v)} />
          </>
        )}

        {pickedVip !== null && (
          <>
            <div className="card mt-6">
              <div className="text-sm mb-2" style={{ color: "#9aa0a6" }}>
                Категория выбрана: {pickedVip ? "VIP" : "Стандарт"}
              </div>
              <BookingForm pcId={pickedVip ? "vip-auto" : "std-auto"} />
            </div>
            <div className="mt-6">
              <button className="tox-button" onClick={() => setPickedVip(null)}>
                Вернуться к выбору категории
              </button>
            </div>
          </>
        )}
      </main>
    </WebAppShell>
  );
}
