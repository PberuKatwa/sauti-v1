import { Module } from "@nestjs/common";
import { WhatsappController } from "../whatsapp/whatsapp.controller";
import { ProductsHandler } from "./products.handler";

@Module({
  imports: [WhatsappController],
  providers: [ProductsHandler],
  exports: [ProductsHandler]
})
export class ProductsModule { };
