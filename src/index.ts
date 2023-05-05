import "dotenv/config";
import { SapphireClient } from "@sapphire/framework";
import { IntentsBitField } from "discord.js";
import { MikroORM, MongoDriver } from "@mikro-orm/mongodb";
import config from "./utils/mikro-orm.config";

const client = new SapphireClient({
	intents: [new IntentsBitField(32767)],
	loadMessageCommandListeners: true,
});

const orm = await MikroORM.init(config);

client.login(process.env.DISCORD_TOKEN)


export { orm };
