import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { OrdersModel } from "./orders.model";

export class OrdersHandler{
  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly whatsappService: WhatsappService,
    private readonly ordersModel:OrdersModel
  ) { };
}
