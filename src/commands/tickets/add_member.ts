import { Args, Command } from "@sapphire/framework";
import {
	CategoryChannel,
	GuildMember,
	Message,
	PermissionsBitField,
	TextChannel,
} from "discord.js";
import { is_ticket } from "../../utils";

export class AddMemberCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "add",
			aliases: [],
			runIn: "GUILD_TEXT",
		});
	}
	// TODO: permissions for only Admins
	public async messageRun(message: Message, args: Args) {
		if (!(await is_ticket(message.channel.id)))
			return message.channel.send("Sorry, this is not a ticket channel.");
		let member = await args.peekResult("member");

		return await member.match({
			ok: async (member: GuildMember) => {
				let channel = message.channel as TextChannel;
				await channel.edit({
					permissionOverwrites: [
						...channel.permissionOverwrites.cache.toJSON(),
						{
							id: member,
							allow: [PermissionsBitField.Flags.ViewChannel],
						},
					],
				});
				return message.channel.send(
					`${member} has been added to this ticket successfully!`
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
