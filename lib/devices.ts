export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  status: "active" | "maintenance";
  specs?: { cpu: string; gpu: string };
  peripherals?: { keyboard?: string; mouse?: string; headset?: string; monitor?: string };
  busyState?: "free" | "busy" | "booked";
};

const stdCount = 16;
const vipCount = 5;

const stdPCs: DeviceItem[] = Array.from({ length: stdCount }).map((_, i) => ({
  id: `pc-${String(i + 1).padStart(2, "0")}`,
  label: `ПК #${String(i + 1).padStart(2, "0")}`,
  platform: "PC",
  isVip: false,
  status: "active",
  specs: { cpu: "Ryzen 5 5600", gpu: i % 2 ? "RTX 4060" : "RTX 3060 Ti" },
  busyState: (i % 7 === 0) ? "busy" : "free",
  peripherals: undefined, // сюда потом добавишь своё железо
}));

const vipPCs: DeviceItem[] = Array.from({ length: vipCount }).map((_, i) => ({
  id: `pc-vip-${String(i + 1).padStart(2, "0")}`,
  label: `ПК VIP #${String(i + 1).padStart(2, "0")}`,
  platform: "PC",
  isVip: true,
  status: "active",
  specs: { cpu: "Intel i5-13400F", gpu: "RTX 4060 Ti" },
  busyState: (i % 3 === 0) ? "booked" : "free",
  peripherals: undefined,
}));

const ps5: DeviceItem = {
  id: "ps5-01",
  label: "PS5 #01",
  platform: "PS5",
  status: "active",
  specs: { cpu: "Zen 2 (8C)", gpu: "RDNA 2" },
  busyState: "free",
  peripherals: undefined,
};

export const devices: DeviceItem[] = [...stdPCs, ...vipPCs, ps5];
