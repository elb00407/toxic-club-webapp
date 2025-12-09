export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  busyState?: "free" | "busy" | "booked";
  specs?: { cpu: string; gpu: string; ram: string };
};

const stdSpecs = { cpu: "Ryzen 5 5600", gpu: "RTX 3060 Ti / 4060", ram: "16 GB" };
const vipSpecs = { cpu: "Intel i5-13400F", gpu: "RTX 4060 Ti", ram: "32 GB" };

const standardPCs: DeviceItem[] = Array.from({ length: 16 }, (_, i) => ({
  id: `pc-${i + 1}`,
  label: `Toxic${i + 1}`,
  platform: "PC",
  isVip: false,
  busyState: "free",
  specs: stdSpecs,
}));

const vipPCs: DeviceItem[] = Array.from({ length: 5 }, (_, i) => ({
  id: `pc-v${i + 1}`,
  label: `ToxicV${i + 1}`,
  platform: "PC",
  isVip: true,
  busyState: "free",
  specs: vipSpecs,
}));

// Оставляем только одну консоль
const consoles: DeviceItem[] = [
  { id: "ps5-1", label: "PS5", platform: "PS5", busyState: "free", specs: { cpu: "Zen 2", gpu: "RDNA 2", ram: "16 GB" } },
];

export const devices: DeviceItem[] = [...standardPCs, ...vipPCs, ...consoles];
