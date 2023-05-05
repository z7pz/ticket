import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { TicketEntity, ConfigEntity } from "../../entities";

export class TestCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "new",
			aliases: [],
		});
	}

	public async messageRun(message: Message) {
// 		const ticket = new TicketEntity("123");
// 		await ticket.save();
// 		await message.channel.send("Created successfully!");
// 		const config = await ConfigEntity.get();
// 		message.channel.send(`${config.tickets}`);
// 		let t = await TicketEntity.findOne({
// 			channel_id: "123",
// 		});
// 
// 		await message.channel.send(t ? "found" : "not found");
	}
}
