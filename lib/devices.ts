export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  status: "active" | "maintenance";
};

export const devices: DeviceItem[] = [
  // ПК стандарт
  { id: "pc-01", label: "ПК #01", platform: "PC", isVip: false, status: "active" },
  { id: "pc-02", label: "ПК #02", platform: "PC", isVip: false, status: "active" },
  { id: "pc-03", label: "ПК #03", platform: "PC", isVip: false, status: "active" },
  { id: "pc-04", label: "ПК #04", platform: "PC", isVip: false, status: "active" },

  // ПК VIP
  { id: "pc-vip-01", label: "ПК VIP #01", platform: "PC", isVip: true, status: "active" },
  { id: "pc-vip-02", label: "ПК VIP #02", platform: "PC", isVip: true, status: "active" },

  // PS5 (ограничение 7 часов — на уровне UI/BookingForm)
  { id: "ps5-01", label: "PS5 #01", platform: "PS5", status: "active" },
  { id: "ps5-02", label: "PS5 #02", platform: "PS5", status: "active" },

  // Для полноты — авто категории (если нужны)
  { id: "std-auto", label: "Авто • Стандарт", platform: "PC", isVip: false, status: "active" },
  { id: "vip-auto", label: "Авто • VIP", platform: "PC", isVip: true, status: "active" },
];
