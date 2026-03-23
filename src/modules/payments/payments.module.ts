import { Module } from "@nestjs/common";
import { PaymentsHandler } from "./payments.handler";

@Module({
  providers: [PaymentsHandler]

})
export class PaymentsModule { };
