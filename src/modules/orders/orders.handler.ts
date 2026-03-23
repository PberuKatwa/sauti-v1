import { Inject } from "@nestjs/common";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { OrdersModel } from "./orders.model";
import { BestIntent } from "../../validators/bestIntent.schema";
import { ClientModel } from "../client/client.model";
import { ProductsHandler, catalog } from "../products/products.handler";

export class OrdersHandler{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly whatsappService: WhatsappService,
    private readonly ordersModel: OrdersModel,
    private readonly clientsModel: ClientModel,
    private readonly productsHandler:ProductsHandler
  ) { };

  private readonly intentMap: Record< string, (msg: string, recipient:string) => Promise<any> > = {
    'CREATE_ORDER': (msg,recipient) => this.handleCreateOrder(msg,recipient),
    'GET_PRODUCT': (msg,recipient) => this.handleGetProduct(msg,recipient)
  };

  public async handleIntent(intent: BestIntent, recipient:string):Promise<void> {
    try {

      const handler = this.intentMap[intent.name];

      if (!handler) throw new Error(`No handler was found`)

      return handler(intent.userMessage, recipient);
    } catch (error) {
      throw error;
    }
  }

  private async handleCreateOrder(userMessage: string, recipient: string) {

    const client = await this.clientsModel.createClient({ phoneNumber: parseInt(recipient) });

    const match = userMessage.match(/ProductID:(\d+)/);
    const productId = match ? Number(match[1]) : null;

    if (!productId) return this.productsHandler.sendFlowerCatalog(recipient);

    const product = catalog.find(item => item.productId === productId);
    const items = product
      ? [
          {
            name: product.name,
            quantity: product.quantity,
            unitPrice: product.unitPrice
          }
        ]
      : [];

    const orderCreated = await this.ordersModel.createOrder({ clientId: client.id, items: items })
    await this.sendOrderInvoice(recipient, orderCreated)
  }

  private async handleGetProduct(userMessage: string, recipient:string) {
    await this.whatsappService.sendText(`WERE AT GET_PRODUCT`, recipient);
  }

  async sendOrderInvoice(recipient: string, order: any) {
    const itemSummary = order.items
      .map((item: any) => `• ${item.name} (x${item.quantity})`)
      .join('\n');

    const payload = {
      messaging_product: "whatsapp",
      to: recipient,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: `Order Confirmation ${order.invoice_number}`
        },
        body: {
          text:
            `Hi there! 💜 Your order has been placed.\n\n` +
            `*Order Details:*\n${itemSummary}\n\n` +
            `*Summary:*\n` +
            `Subtotal: KES ${Number(order.subtotal).toLocaleString()}\n` +
            `Tax (VAT): KES ${Number(order.tax).toLocaleString()}\n` +
            `*Total: KES ${Number(order.total).toLocaleString()}*\n\n` +
            `Status: _${order.status.toUpperCase()}_`
        },
        footer: {
          text: "Thank you for choosing Purple Hearts 🌸"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: `pay for order OrderId:${order.id}`,
                title: "Pay Now 💳"
              }
            },
            {
              type: "reply",
              reply: {
                id: `track order location - OrderId:${order.id}`,
                title: "Track Order Location"
              }
            }
          ]
        }
      }
    };

    await this.whatsappService.callApi(recipient, payload);
  }

}
