import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";


class HandlerReplyService{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly intentDetector:IntentDetectorService
  ) { };

}
