import { Module } from "@nestjs/common";
import { WhatsappController } from "../whatsapp/whatsapp.controller";

@Module({
  imports: [WhatsappController],

})
export class ProductsModule { };
