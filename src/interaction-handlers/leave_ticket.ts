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
import { TicketEntity, TicketStatus } from "../entities";

export class ButtonHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}
	public override async parse(interaction: ButtonInteraction) {
		if (interaction.customId !== EButtonId.LeaveTicket) return this.none();
		if (!(await is_ticket(interaction.channel.id))) return this.none();
		if (
			!(interaction.member.roles as GuildMemberRoleManager).cache.hasAny(
				ERoles.Designers,
				ERoles.Supports
			)
		) {
			// Supported roles
			const primary_role = interaction.guild.roles.cache.get(
				ERoles.Supports
			);
			const secondary_role = interaction.guild.roles.cache.get(
				ERoles.Designers
			);
			await interaction.reply({
				content: `Sorry, you cant calim this ticket because you should be ${primary_role} or ${secondary_role} to claim it.`,
				ephemeral: true,
			});
			return this.none();
		}
		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const Ticket = await TicketEntity.findOne({
			channel_id: interaction.channel.id,
		});

		if (!Ticket.claimed_by)
			return interaction.reply("Sorry, no one was calimed the ticket.");
		if (Ticket.claimed_by !== interaction.user.id)
			return interaction.reply(
				"Sorry, you are not the one that claimed the ticket."
			);

		Ticket.claimed_by = null;

		await Ticket.save();

		await interaction.channel
			.edit({
				parent: ECategories.Orders,
				topic: `claimed by: UnKnown, Discount: ${
					Ticket.coupon ? Ticket.coupon.discount : 0
				}%`,
				name: `ticket-${Ticket.ticket_index}`,
			})
			.catch((e) =>
				interaction.reply(
					"Sorry, Something went worng, (editing the channel)"
				)
			);
		Ticket.status = TicketStatus.Orders;
		await Ticket.save();
		// Supported roles
		const primary_role = interaction.guild.roles.cache.get(ERoles.Supports);
		const secondary_role = interaction.guild.roles.cache.get(
			ERoles.Designers
		);

		return interaction.channel.send(
			`${primary_role}, ${secondary_role} you can calim this ticket again.`
		);
	}
}
