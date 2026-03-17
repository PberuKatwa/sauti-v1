import { z } from 'zod';

export const WhatsappWebhookSchema = z.object({
  object: z.literal("whatsapp_business_account"),
  entry: z.array(z.object({
    id: z.string(),
    changes: z.array(z.object({
      field: z.string(),
      value: z.object({
        messaging_product: z.literal("whatsapp"),
        messages: z.array(z.object({
          from: z.string(),
          id: z.string(),
          timestamp: z.string(),
          type: z.enum(["text", "interactive"]),
          text: z.object({ body: z.string() }).optional(),
          interactive: z.any().optional(), // You can expand this as needed
        })).optional(),
      }).optional(),
    }))
  }))
});
