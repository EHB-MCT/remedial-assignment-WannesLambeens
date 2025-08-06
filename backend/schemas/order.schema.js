import { z } from "zod";

export const orderSchema = z.object({
  playerId: z.string().length(24, "Invalid playerId"),
  ticker: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  type: z.enum(["MARKET", "LIMIT"]),
  quantity: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Quantity must be greater than 0",
  }),
  limitPrice: z
    .string()
    .optional()
    .refine((val) => !val || parseFloat(val) > 0, {
      message: "limitPrice must be > 0",
    }),
});
