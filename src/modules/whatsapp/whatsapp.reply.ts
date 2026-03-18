import { BestIntent } from "../../types/intent.types";
import { WhatsappService } from "./whatsapp.service";

export class WhatsappReplyService extends WhatsappService{

  async processMessage(intent: BestIntent, recipient:string) {
    try {

      if( intent.id === "MAKE_ORDER" ){

        await this.sendFlowerCatalog(recipient);

      }else if( intent.id === "TRACK_ORDER" ){

        await this.sendText(`I can check your order status. Please share your order number or tracking ID.`, recipient)

      }else if( intent.id === "PAY_FOR_ORDER" ){

        await this.sendText(`How can I help you with payment? Are you checking options or need help with a transaction?`, recipient )

      }else if( intent.id === "UNKNOWN" ){

        await this.sendText("UNKNOWN", recipient)

        // whatsappClient.sendTemplate(`hello_world`,'en_US')
        // whatsappClient.sendTemplate(`order_try`,'en_GB')

      }

    } catch (error) {
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
