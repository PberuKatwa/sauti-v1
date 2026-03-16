import { Module } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

@Module({
  controllers:[WhatsappController],
  providers: [
    WhatsappService,
    {
      provide: 'WHATSAPP_TOKEN',
      useValue: 'your-secret-token',
    },
    {
      provide: 'WHATSAPP_PHONE_ID',
      useValue: '123456789',
    }
  ],
  exports:[WhatsappService]
})
export class WhatsappModule { };
