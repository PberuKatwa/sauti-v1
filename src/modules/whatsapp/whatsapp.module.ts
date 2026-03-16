import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WhatsappService } from "./whatsapp.service";
import { WhatsappController } from "./whatsapp.controller";

@Module({
  controllers:[WhatsappController],
  providers: [
      WhatsappService,
      {
        provide: 'WHATSAPP_TOKEN',
        useFactory: (config: ConfigService) => config.get<string>('whatsappAccessToken'),
        inject: [ConfigService],
      },
      {
        provide: 'WHATSAPP_PHONE_ID',
        useFactory: (config: ConfigService) => config.get<string>('phoneNumberId'),
        inject: [ConfigService],
      },
    ],
  exports:[WhatsappService]
})
export class WhatsappModule { };
