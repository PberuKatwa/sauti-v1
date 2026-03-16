export interface WhatsappWebhook{

    object:"whatsapp_business_account";
    entry:Array<WebhookEntry>;

}

export interface WebhookEntry{
    id:string;
    changes:Array<WebhookChanges>
}

export interface WebhookChanges{

    field:string;
    value?:{
        messaging_product:"whatsapp";
        statuses?:Array<StatusesValue>;
        contacts?: Array<ContactsValue>;
        messages?:Array<IncomingMessages>;
    };


}

export interface StatusesValue{
    id:string;
    status:string;
    timestamp:string;
    recepient_id:string
}

export interface ContactsValue{
    profile:{
        name:string;
    };
    wa_id:string;
}

export interface IncomingMessages {
  from: string;
  id: string;
  timestamp: string;

  type: "text" | "interactive";

  text?: {
    body: string;
  };

  interactive?: {
    button_reply?: {
      id: string;
      title: string;
    };

    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
}
