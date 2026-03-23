import { Module } from "@nestjs/common";
import { HandlerService } from "./handler.service";
import { IntentModule } from "../intent/intent.module";
import { ProductsModule } from "../products/products.module";
import { PaymentsModule } from "../payments/payments.module";
import { OrdersModule } from "../orders/orders.module";
import { CustomerCareModule } from "../customerCare/care.module";

@Module({
  imports: [IntentModule, ProductsModule, PaymentsModule, OrdersModule, CustomerCareModule],
  providers: [HandlerService],
  exports:[HandlerService]

})
export class HandlerModule { };
