import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WhatsappWebhook } from "../../types/whatsapp.webhook";
import { WhatsappWebhookSchema } from "../../validators/webhook.schema";

export class HandlerService{

  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) { };

  private validateWhatsappWebhook(webhook:WhatsappWebhook) {
    try {

      const validatedData = WhatsappWebhookSchema.parse(webhook);
      if (!validatedData) throw new Error(`The whatsapp webhook is malformed`);
      return validatedData;

    } catch (error) {
      throw error;
    }
  }

  public async whatsappReply(message:WhatsappWebhook):Promise<string> {
    try {

      const payload = this.validateWhatsappWebhook(message);

      const changes = payload.entry?.[0]?.changes?.[0];

      const messages = changes.value?.messages;

      if (!messages?.length) return `No ,`

      const msg = messages[0];
      const sender = parseInt(msg.from);
      let userMessage: string | undefined;

      // Extract message content
      if (msg.type === "text") {
        userMessage = msg.text?.body;
      } else if (msg.type === "interactive") {
        userMessage = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id;
      }

      if (!userMessage) {
        throw new Error("Unsupported message type");
      }

    } catch (error) {
      throw error;
    }
  }

}
