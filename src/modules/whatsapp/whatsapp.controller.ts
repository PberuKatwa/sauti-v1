import { Controller, Inject, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { APP_LOGGER } from "../../logger/logger.provider";
import { AppLogger } from "../../logger/winston.logger";
import { WhatsappService } from "./whatsapp.service";
import { ConfigService } from "@nestjs/config";
import { ApiResponse } from "../../types/api.types";

@Controller('whatsapp')
export class WhatsappController{

  constructor(
    @Inject(APP_LOGGER) private readonly logger: AppLogger,
    private readonly whatsappService: WhatsappService,
    private readonly configService: ConfigService
  ) { };


  async verifyWebhook(
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {

      const mode =  req.query['hub.mode']
      const challenge = req.query['hub.challenge']
      const verifyToken = req.query['hub.verify_token']

      if( mode && verifyToken === this.configService.get<string>('metaVerifyToken') ){
        return res.status(200).send(challenge)
      } else {
        return res.sendStatus(403)
      }

    } catch (error:any) {
      this.logger.error('Error in veryfying webhook from meta whatsapp',{
        errorMessage:error.message,
        errorStack:error.stack
      })

      const response:ApiResponse = {
        success:false,
        message:error.message
      }

      res.status(500).json(response)
    }
  }

  async receiveFromWebhook(
    req: Request<{}, {}, WhatsappWebhook>,
    res: Response
  ) {
    try {

      console.log("webhook configgg", JSON.stringify(req.body, null, 2));

      const changes = req.body.entry?.[0]?.changes?.[0];

      if (!changes) {
        return res.status(400).json({ error: "Invalid webhook payload" });
      }

      const messages = changes.value?.messages;

      if (!messages?.length) {
        return res.status(200).json("No messages");
      }

      const msg = messages[0];

      console.log("Incoming message:", msg);

      const sender = parseInt(msg.from);

      let userMessage: string | undefined;

      // TEXT MESSAGE
      if (msg.type === "text") {
        userMessage = msg.text?.body;
      }

      // BUTTON CLICK
      if (msg.type === "interactive" && msg.interactive?.button_reply) {
        userMessage = msg.interactive.button_reply.id;
      }

      // LIST SELECTION
      if (msg.type === "interactive" && msg.interactive?.list_reply) {
        userMessage = msg.interactive.list_reply.id;
      }

      if (!userMessage) {
        throw new Error("Unsupported message type");
      }

      const reply = await replyService(sender, userMessage);

      res.status(200).json("Webhook processed");

    } catch (error: any) {

      logger.error("Error receiving WhatsApp webhook", {
        errorMessage: error.message,
        errorStack: error.stack,
      });

      res.status(200).json("Webhook processed");
    }
  }

}
