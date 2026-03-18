import { BestIntent } from "../../types/intent.types";
import { WhatsappService } from "./whatsapp.service";

export class WhatsappReplyService extends WhatsappService{

  async processMessage(intent: BestIntent) {
    try {

      let messageReply = "UNKNOWN";

      if( intent.id === "MAKE_ORDER" ){

        // whatsappClient.sendText(`Great! Ready to place a new order. What items are you interested in today?`)
        whatsappClient.sendFlowerCatalog();


      }else if( intent.id === "TRACK_ORDER" ){

        whatsappClient.sendText(`I can check your order status. Please share your order number or tracking ID.`)


      }else if( intent.id === "PAY_FOR_ORDER" ){

        whatsappClient.sendText(`How can I help you with payment? Are you checking options or need help with a transaction?` )

      }else if( intent.id === "UNKNOWN" ){

        const gemini = new GeminiChatService(config.GEMINI_TOKEN)
        whatsappClient.sendText( await gemini.basicPrompt(prompt) )

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
