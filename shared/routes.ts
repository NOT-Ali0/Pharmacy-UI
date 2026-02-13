import { z } from "zod";
import {
  ROLE,
  ORDER_STATUS,
  appStateSchema,
  currentUserSchema,
  medicineSchema,
  supplierSchema,
  pharmacySchema,
  supplierMedicineSchema,
  orderSchema,
  notificationSchema,
} from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  app: {
    health: {
      method: "GET" as const,
      path: "/api/health" as const,
      responses: {
        200: z.object({ ok: z.literal(true) }),
      },
    },
  },
  auth: {
    me: {
      method: "GET" as const,
      path: "/api/me" as const,
      responses: {
        200: currentUserSchema.nullable(),
      },
    },
  },
  // NOTE: the app is frontend-only w/ LocalStorage, but we still define a contract
  // so react-query + fetcher can be consistent if needed.
  state: {
    get: {
      method: "GET" as const,
      path: "/api/state" as const,
      responses: {
        200: appStateSchema,
      },
    },
  },
  entities: {
    medicines: {
      list: {
        method: "GET" as const,
        path: "/api/medicines" as const,
        responses: {
          200: z.array(medicineSchema),
        },
      },
    },
    suppliers: {
      list: {
        method: "GET" as const,
        path: "/api/suppliers" as const,
        input: z
          .object({
            search: z.string().optional(),
          })
          .optional(),
        responses: {
          200: z.array(supplierSchema.omit({ password: true })),
        },
      },
    },
    pharmacies: {
      list: {
        method: "GET" as const,
        path: "/api/pharmacies" as const,
        responses: {
          200: z.array(pharmacySchema.omit({ password: true })),
        },
      },
    },
    supplierMedicines: {
      listBySupplier: {
        method: "GET" as const,
        path: "/api/suppliers/:supplierId/medicines" as const,
        input: z
          .object({
            search: z.string().optional(),
            sortBy: z.enum(["name", "price", "stock"]).optional(),
            sortDir: z.enum(["asc", "desc"]).optional(),
            onlyAvailable: z.boolean().optional(),
          })
          .optional(),
        responses: {
          200: z.array(
            supplierMedicineSchema.extend({
              medicine: medicineSchema,
              supplier: supplierSchema.omit({ password: true }),
            })
          ),
          404: errorSchemas.notFound,
        },
      },
    },
    orders: {
      list: {
        method: "GET" as const,
        path: "/api/orders" as const,
        input: z
          .object({
            role: z.enum(ROLE),
            userId: z.string(),
            status: z.enum(ORDER_STATUS).optional(),
          })
          .optional(),
        responses: {
          200: z.array(orderSchema),
        },
      },
    },
    notifications: {
      list: {
        method: "GET" as const,
        path: "/api/notifications" as const,
        input: z
          .object({
            role: z.enum(ROLE),
            userId: z.string(),
          })
          .optional(),
        responses: {
          200: z.array(notificationSchema),
        },
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, String(value));
    }
  }
  return url;
}

export type CurrentUserResponse = z.infer<typeof api.auth.me.responses[200]>;
export type AppStateResponse = z.infer<typeof api.state.get.responses[200]>;
