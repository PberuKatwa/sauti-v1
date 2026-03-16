import { Controller, Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";

@Controller()
export class WhatsappController{
  constructor(@Inject(APP_LOGGER) private readonly logger: AppLogger) { };
}
