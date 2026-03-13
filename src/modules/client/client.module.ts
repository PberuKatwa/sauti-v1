import { Module } from "@nestjs/common";
import { ClientModel } from "./client.model";
import { PostgresModule } from "../../databases/postgres.module";
import { ClientsController } from "./client.controller";

@Module({
  controllers:[ClientsController],
  providers: [ClientModel],
  exports:[ClientModel]
})
export class ClientModule { };
