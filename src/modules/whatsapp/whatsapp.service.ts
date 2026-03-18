import axios, { AxiosError } from "axios";
import { Inject, Injectable } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import type { AppLogger } from "../../logger/winston.logger";
import { WhatsappTemplate, WhatsappText, WhatsappUnionMessage } from "../../types/whatsapp.base";

@Injectable()
export class WhatsappService{
  constructor(

    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    @Inject('WHATSAPP_TOKEN') private readonly token: string,
    @Inject('WHATSAPP_PHONE_ID') private readonly phoneId: string,
  ) {};

  private async callApi( recipient:string, data:any ) {
    try {
      this.logger.httpreq("Calling whatsapp api", { recipient: recipient, data: data.type });

      const response = await axios.post(
        `https://graph.facebook.com/v22.0/${this.phoneId}/messages`,
        data,
        { headers: { Authorization:`Bearer ${this.token}`, "Content-Type":'application/json' } }
      )

      this.logger.info("WhatsApp API success", { status: response.status });

      return response.data

    } catch (error) {
      throw error;
    }
  }

  public async sendTemplate( templateName:string, language:string = 'en_US', recipient:string ){

    try{

      if(!templateName) throw new Error(`No template name was provided`);

      this.logger.warn(`Beginning sending of template:${templateName} whatsapp message`)

      const payload: WhatsappTemplate = {
        messaging_product: "whatsapp",
        to: `${recipient}`,
        type: 'template',
        template: {
          name: templateName,
          language: { code: language }
        }
      };

      const response = await this.callApi(recipient, payload);

      this.logger.info(`Successfully sent whatsapp template message`)
      return response
    }catch(error:any){
      throw error
    }
  }

  async sendText(textBody:string, recipient:string){
    try{

      if (!textBody.trim()) {
      throw new Error("sendText: textBody is required");
      }

      this.logger.warn('Begining sending text whatsapp message');

      const payload: WhatsappText = {
        messaging_product: "whatsapp",
        to: `${recipient}`,
        type: 'text',
        text: {
          body: textBody
        }
      };

      const response = await this.callApi(recipient, payload);

      return response;
    }catch(error){
      throw error;
    }
  }

  async sendFlowerCatalog(recipient:string){

    const flowers = [
      "https://www.purpink.co.ke/cdn/shop/files/Screenshot2025-04-08at17.46.02.png?v=1744784467&width=535",
      "https://www.purpink.co.ke/cdn/shop/files/f636f5c0-28dc-4b29-9a91-ffd8f6716894_Savage_Love.jpg?v=1769510893&width=535",
      "https://www.purpink.co.ke/cdn/shop/files/premium-flower-arrangement-new.jpg?v=1758710108&width=535",
    ];

    for (let i = 0; i < flowers.length; i++) {

      const payload = {
        messaging_product: "whatsapp",
        to: `${recipient}`,
        type: "interactive",
        interactive: {
          type: "button",
          header: {
            type: "image",
            image: { link: flowers[i] }
          },
          body: {
            text: `Flower ${i+1}`
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: `flower_${i+1}`,
                  title: "Order"
                }
              }
            ]
          }
        }
      };

      await this.callApi(recipient,payload);
    }
  }

}
