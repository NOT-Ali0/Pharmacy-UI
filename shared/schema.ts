import { z } from "zod";

export const ROLE = ["pharmacy", "supplier"] as const;
export type Role = (typeof ROLE)[number];

export const ORDER_STATUS = ["pending", "approved", "rejected"] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const medicineSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  dosage: z.string().min(1),
  form: z.string().min(1),
});
export type Medicine = z.infer<typeof medicineSchema>;

export const supplierSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
  phone: z.string().min(1),
  locationName: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});
export type Supplier = z.infer<typeof supplierSchema>;

export const pharmacySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
  phone: z.string().min(1),
  address: z.string().min(1),
});
export type Pharmacy = z.infer<typeof pharmacySchema>;

export const supplierMedicineSchema = z.object({
  id: z.string(),
  supplierId: z.string(),
  medicineId: z.string(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  available: z.boolean(),
});
export type SupplierMedicine = z.infer<typeof supplierMedicineSchema>;

export const orderItemSchema = z.object({
  id: z.string(),
  supplierMedicineId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  id: z.string(),
  supplierId: z.string(),
  pharmacyId: z.string(),
  status: z.enum(ORDER_STATUS),
  createdAt: z.string(),
  items: z.array(orderItemSchema).min(1),
  note: z.string().optional(),
  decisionNote: z.string().optional(),
});
export type Order = z.infer<typeof orderSchema>;

export const currentUserSchema = z.object({
  role: z.enum(ROLE),
  userId: z.string(),
});
export type CurrentUser = z.infer<typeof currentUserSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  title: z.string().min(1),
  message: z.string().min(1),
  read: z.boolean(),
  user: currentUserSchema.optional(),
});
export type Notification = z.infer<typeof notificationSchema>;

// =========================
// LocalStorage state shape
// =========================
export const appStateSchema = z.object({
  version: z.number(),
  medicines: z.array(medicineSchema),
  suppliers: z.array(supplierSchema),
  pharmacies: z.array(pharmacySchema),
  supplierMedicines: z.array(supplierMedicineSchema),
  orders: z.array(orderSchema),
  notifications: z.array(notificationSchema),
});
export type AppState = z.infer<typeof appStateSchema>;

// =========================
// Explicit "API-like" request/response types
// (frontend-only app still benefits from explicit contracts)
// =========================
export type RegisterRequest = {
  role: Role;
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  locationName?: string;
  lat?: number;
  lng?: number;
};

export type LoginRequest = {
  role: Role;
  email: string;
  password: string;
};

export type CreateSupplierMedicineRequest = Omit<SupplierMedicine, "id">;
export type UpdateSupplierMedicineRequest = Partial<Omit<SupplierMedicine, "id" | "supplierId" | "medicineId">>;

export type CreateOrderRequest = {
  supplierId: string;
  pharmacyId: string;
  items: Array<{
    supplierMedicineId: string;
    quantity: number;
  }>;
  note?: string;
};

export type DecideOrderRequest = {
  status: Exclude<OrderStatus, "pending">;
  decisionNote?: string;
};
