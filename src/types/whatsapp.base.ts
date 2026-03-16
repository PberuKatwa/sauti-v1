export interface WhatsappBase{
    messaging_product: "whatsapp";
    to: string;
}

export interface WhatsappTemplate extends WhatsappBase{
    type:'template';
    template: {
        name: string;
        language: { code: string };
    };
}

export interface WhatsappText extends WhatsappBase{
    type:'text';
    text:{
        body:string;
    }
}

export interface WhatsappImage extends WhatsappBase{
    type:"image",
    image: {
        link: string;
        caption?: string;
    };
}

export type WhatsappUnionMessage = WhatsappImage | WhatsappText | WhatsappTemplate
