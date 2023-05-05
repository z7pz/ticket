import {
	InteractionHandler,
	InteractionHandlerTypes,
	PieceContext,
} from "@sapphire/framework";
import {
	ButtonInteraction,
	GuildMemberRoleManager,
	PermissionsBitField,
} from "discord.js";
import { EButtonId, ECategories, ERoles, is_ticket } from "../utils";
import { TicketEntity } from "../entities";

export class ButtonHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}
	public override async parse(interaction: ButtonInteraction) {
		if (interaction.customId !== EButtonId.LockTicket) return this.none();
		if (!(await is_ticket(interaction.channel.id))) return this.none();
		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const is_support = (
			interaction.member.roles as GuildMemberRoleManager
		).cache.has(ERoles.Supports);
		const is_admin = (
			interaction.member.permissions as PermissionsBitField
		).has("Administrator");
		if (!is_support && !is_admin)
			return await interaction.reply(
				"Sorry, only admins and supports can run this."
			);
		const Ticket = await TicketEntity.findOne({
			channel_id: interaction.channel.id,
		});
		await interaction.channel.edit({
			parent: ECategories.Lock,
			name: `locked-${Ticket.ticket_index}`,
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
			],
		}).catch((e) =>
		interaction.reply(
			"Sorry, Something went worng, (editing the channel)"
		)
	);;
		return await interaction.reply(
			"This ticket successfully moved to lock category!"
		);
	}
}
