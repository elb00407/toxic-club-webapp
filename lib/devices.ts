export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  status: "active" | "maintenance";
};

const stdCount = 16;
const vipCount = 5;

const stdPCs: DeviceItem[] = Array.from({ length: stdCount }).map((_, i) => ({
  id: `pc-${String(i + 1).padStart(2, "0")}`,
  label: `ПК #${String(i + 1).padStart(2, "0")}`,
  platform: "PC",
  isVip: false,
  status: "active",
}));

const vipPCs: DeviceItem[] = Array.from({ length: vipCount }).map((_, i) => ({
  id: `pc-vip-${String(i + 1).padStart(2, "0")}`,
  label: `ПК VIP #${String(i + 1).padStart(2, "0")}`,
  platform: "PC",
  isVip: true,
  status: "active",
}));

const ps5: DeviceItem = { id: "ps5-01", label: "PS5 #01", platform: "PS5", status: "active" };

export const devices: DeviceItem[] = [...stdPCs, ...vipPCs, ps5];
