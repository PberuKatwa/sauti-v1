import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WhatsappWebhook } from "../../types/whatsapp.webhook";

export class HandlerValidator{

  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) { };

  private validateWhatsappWebhook(webhook:WhatsappWebhook) {
    try {

    } catch (error) {
      throw error;
    }
  }

}
