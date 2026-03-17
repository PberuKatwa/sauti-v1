import { WebhookType } from "./whatsapp.webhook";

export interface WhatsappReply {
  type: WebhookType;
  messageReply: null | string;
  recipient: null | string;
}
