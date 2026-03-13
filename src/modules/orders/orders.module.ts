import { Module } from "@nestjs/common";
import { OrdersModel } from "./orders.model";
import { OrdersController } from "./orders.controllers";

@Module({
  imports: [],
  providers:[OrdersModel],
  controllers:[OrdersController],
  exports:[OrdersModel]
})
export class OrdersModule { };
