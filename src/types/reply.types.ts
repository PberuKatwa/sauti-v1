import { WebhookType } from "./whatsapp.webhook";

export interface whatsappReply {
  type: WebhookType;
  messageReply: null | string;
  recipient: null | string;
}
