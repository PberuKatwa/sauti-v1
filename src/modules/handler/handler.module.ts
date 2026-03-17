import { Module } from "@nestjs/common";
import { HandlerService } from "./handler.service";

@Module({

  providers:[HandlerService]

})
export class HandlerModule { };
