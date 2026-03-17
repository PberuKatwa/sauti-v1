import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WebhookType, WhatsappWebhook } from "../../types/whatsapp.webhook";
import { WhatsappWebhookSchema } from "../../validators/webhook.schema";

export class HandlerService{

  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) { };

  private validateWhatsappWebhook(webhook: WhatsappWebhook): {
    type: WebhookType,
    data:WhatsappWebhook
  } {
    try {

      const validatedData = WhatsappWebhookSchema.parse(webhook);
      if (!validatedData) throw new Error(`The whatsapp webhook is malformed`);

      const value = validatedData.entry?.[0]?.changes?.[0]?.value;

      let type: WebhookType = "UNKNOWN";
      if (value.messages && value.messages.length > 0) type = "MESSAGE";
      if (value.statuses && value.statuses.length > 0) type = "STATUS";


      return {
        type: type,
        data:validatedData
      };

    } catch (error) {
      throw error;
    }
  }

  private async extractWebhookType(payload: WhatsappWebhook) {
    try {

      const data = WhatsappWebhookSchema.parse(payload);
      const value = data.entry?.[0]?.changes?.[0]?.value;

      if (!value) return { type: 'UNKNOWN', data: 'No value found' };

      // 2. Identify and Process
      if (value.messages && value.messages.length > 0) {
        return this.processMessage(value.messages[0]);
      }

      if (value.statuses && value.statuses.length > 0) {
        return this.processStatus(value.statuses[0]);
      }

      return { type: 'UNKNOWN', data: value };

    } catch (error) {
      this.logger.error("Failed to handle webhook", error);
      throw error;
    }
  }

  private extractMessageAndRecepient(message: WhatsappWebhook): {
    userMessage: string,
    recipient:string
  }{
    try {

      const data = this.validateWhatsappWebhook(message);
      const changes = data.entry?.[0]?.changes?.[0];
      const messages = changes.value?.messages;

      if (!messages?.length) throw new Error(`No messages were found`);

      const msg = messages[0];
      const sender = msg.from;
      let userMessage: string | undefined;

      if (msg.type === "text") {
        userMessage = msg.text?.body;
      } else if (msg.type === "interactive") {
        userMessage = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id;
      }

      return {
        userMessage: userMessage,
        recipient:sender
      }

    } catch (error) {
      throw error;
    }
  }

  public async whatsappReply(payload: WhatsappWebhook):Promise<{
    messageReply: string,
    recipient:string
  }> {
    try {

      const { userMessage, recipient } = this.extractMessageAndRecepient(payload);

      return {
        messageReply: "hello",
        recipient:recipient
      }

    } catch (error) {
      throw error;
    }
  }

  @Injectable()
  export class HandlerService {
    constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) {}

    public async handleIncomingWebhook(payload: WhatsappWebhook) {
      try {
        // 1. Validate
        const data = WhatsappWebhookSchema.parse(payload);
        const value = data.entry?.[0]?.changes?.[0]?.value;

        if (!value) return { type: 'UNKNOWN', data: 'No value found' };

        // 2. Identify and Process
        if (value.messages && value.messages.length > 0) {
          return this.processMessage(value.messages[0]);
        }

        if (value.statuses && value.statuses.length > 0) {
          return this.processStatus(value.statuses[0]);
        }

        return { type: 'UNKNOWN', data: value };

      } catch (error) {
        this.logger.error("Failed to handle webhook", error);
        throw error;
      }
    }

    private processMessage(msg: any): WebhookResult {
      const sender = msg.from;
      let content = '';

      switch (msg.type) {
        case 'text':
          content = msg.text?.body || '';
          break;
        case 'interactive':
          content = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || '';
          break;
        default:
          content = `Unsupported type: ${msg.type}`;
      }

      return { type: 'MESSAGE', sender, content };
    }

    private processStatus(status: any): WebhookResult {
      return {
        type: 'STATUS',
        recipient: status.recipient_id,
        status: status.status, // 'sent', 'delivered', 'read', 'failed'
        messageId: status.id
      };
    }
  }

}
