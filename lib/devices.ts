export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
};

// Генерация Standard: Toxic1..Toxic16
const standardPCs: DeviceItem[] = Array.from({ length: 16 }, (_, i) => {
  const n = i + 1;
  return {
    id: `pc-${n}`,
    label: `Toxic${n}`,
    platform: "PC",
    isVip: false,
  };
});

// Генерация VIP: ToxicV1..ToxicV5
const vipPCs: DeviceItem[] = Array.from({ length: 5 }, (_, i) => {
  const n = i + 1;
  return {
    id: `pc-v${n}`,
    label: `ToxicV${n}`,
    platform: "PC",
    isVip: true,
  };
});

// Консоли при необходимости
const consoles: DeviceItem[] = [
  { id: "ps5-1", label: "PS5-A", platform: "PS5" },
  { id: "ps5-2", label: "PS5-B", platform: "PS5" },
];

export const devices: DeviceItem[] = [...standardPCs, ...vipPCs, ...consoles];
