import { Command } from "@sapphire/framework";
import {
	Message,
	ButtonBuilder,
	ActionRow,
	ButtonStyle,
	ActionRowBuilder,
} from "discord.js";
import { EButtonId } from "../../utils";

export class CreateTicketMessageCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "create_ticket",
			aliases: ["ct"],
			description: "Creating ticket message...",
		});
	}

	public async messageRun(message: Message) {
	
	}
}
