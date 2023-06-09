import { Args, Command } from "@sapphire/framework";
import type { Message, TextChannel } from "discord.js";
import { ERoles, is_ticket } from "../../utils";

export class RenameCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "rename",
			aliases: [],
			runIn: "GUILD_TEXT",
		});
	}
	public async messageRun(message: Message, args: Args) {
		if(!message.member.roles.cache.hasAny(ERoles.Designers, ERoles.Supports)) {
			return message.reply("Sorry, only Support or Designers can add member.");
		}
		if (!(await is_ticket(message.channel.id)))
			return message.channel.send("Sorry, this is not a ticket channel.");
		let name = await args.peekResult("string", { minimum: 3 });
		return await name.match({
			ok: async (name: string) => {
				let channel = message.channel as TextChannel;
				await channel.edit({
					name,
				});
				return message.channel.send(
					"The channel's name has been renamed successfully!"
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
