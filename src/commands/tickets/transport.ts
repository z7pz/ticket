import { Args, Command } from "@sapphire/framework";
import type { CategoryChannel, Message, TextChannel } from "discord.js";
import { ERoles, is_ticket } from "../../utils";

export class TransportCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "transport",
			aliases: [],
			runIn: "GUILD_TEXT",
		});
	}
	public async messageRun(message: Message, args: Args) {
		if (
			!message.member.roles.cache.hasAny(
				ERoles.Designers,
				ERoles.Supports
			)
		) {
			return message.reply(
				"Sorry, only Support or Designers can add member."
			);
		}
		if (!(await is_ticket(message.channel.id)))
			return message.channel.send("Sorry, this is not a ticket channel.");
		let category = await args.peekResult("guildCategoryChannel");

		return await category.match({
			ok: async (parent: CategoryChannel) => {
				let channel = message.channel as TextChannel;
				await channel.edit({ parent });
				return message.channel.send(
					`The ticket has been transported to ${parent} category successfully!`
				);
			},
			err: (err: any) =>
				message.channel
					.send("" + err)
					.catch(
						() => void message.channel.send("Something went wrong")
					),
		});
	}
}
