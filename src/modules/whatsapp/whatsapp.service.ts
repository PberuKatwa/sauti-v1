import axios, { AxiosError } from "axios";
import { Inject, Injectable } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import type { AppLogger } from "../../logger/winston.logger";
import { WhatsappUnionMessage } from "../../types/whatsapp.base";

@Injectable()
export class WhatsappService{

  private readonly token: string;
  private readonly phoneId: string;

  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) { };

  private callApi( recepient:string, data:WhatsappUnionMessage ) {
    try {
      this.logger.httpreq("Calling whatsapp api", { recipient: recepient, data: data.type });

      const response = ``

    } catch (error) {
      throw error;
    }
  }

}
