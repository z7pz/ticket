import { Options } from "@mikro-orm/mongodb";
import { ConfigEntity, CouponEntity, TicketEntity } from "../entities";

const config: Options = {
	type: "mongo",
	clientUrl: process.env.DATABASE_URL,
	dbName: "TicketsTool",
	entities: [TicketEntity, ConfigEntity, CouponEntity],
	dynamicImportProvider: (id) => require(id)
};

export default config;