import { z } from 'zod';

const StatusesValueSchema = z.object({
  id: z.string(),
  status: z.string(),
  timestamp: z.string(),
  recepient_id: z.string(),
});

const ContactsValueSchema = z.object({
  profile: z.object({
    name: z.string(),
  }),
  wa_id: z.string(),
});

const InteractiveSchema = z.object({
  type: z.enum(["button_reply", "list_reply"]).optional(),
  button_reply: z.object({
    id: z.string(),
    title: z.string(),
  }).optional(),
  list_reply: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
  }).optional(),
});

const IncomingMessagesSchema = z.object({
  from: z.string(),
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(["text", "interactive"]),
  text: z.object({
    body: z.string(),
  }).optional(),
  interactive: InteractiveSchema.optional(),
});

export const WhatsappWebhookSchema = z.object({
  object: z.literal("whatsapp_business_account"),
  entry: z.array(z.object({
    id: z.string(),
    changes: z.array(z.object({
      field: z.string(),
      value: z.object({
        messaging_product: z.literal("whatsapp"),
        statuses: z.array(StatusesValueSchema).optional(),
        contacts: z.array(ContactsValueSchema).optional(),
        messages: z.array(IncomingMessagesSchema).optional(),
      }).optional(),
    }))
  }))
});

export type WhatsappWebhookDto = z.infer<typeof WhatsappWebhookSchema>;
