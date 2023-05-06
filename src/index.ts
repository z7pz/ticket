import "dotenv/config";
import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits, IntentsBitField } from "discord.js";
import { MikroORM, MongoDriver } from "@mikro-orm/mongodb";
import config from "./utils/mikro-orm.config";

const client = new SapphireClient({
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent
	],
	loadMessageCommandListeners: true,
	caseInsensitiveCommands: true,
	// disableMentionPrefix: true,
	defaultPrefix: "!",
});

const orm = await MikroORM.init(config);

client.login(process.env.DISCORD_TOKEN)


export { orm };
