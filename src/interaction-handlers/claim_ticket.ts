import {
	InteractionHandler,
	InteractionHandlerTypes,
	PieceContext,
} from "@sapphire/framework";
import {
	ButtonInteraction,
	GuildMemberRoleManager,
	PermissionsBitField,
	TextChannel,
} from "discord.js";
import { EButtonId, ECategories, ERoles } from "../utils";
import { is_ticket } from "../utils/checkChannel";
import { TicketEntity, TicketStatus } from "../entities";

export class ButtonHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}
	public override async parse(interaction: ButtonInteraction) {
		console.log(interaction.customId);
		if (interaction.customId !== EButtonId.ClaimTicket) return this.none();
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
		if (Ticket.claimed_by) {
			return await interaction.reply({
				content: "Sorry, someone else claimed the ticket before.",
				ephemeral: true,
			});
		}

		// Supported roles
		const primary_role = interaction.guild.roles.cache.get(ERoles.Supports);
		const secondary_role = interaction.guild.roles.cache.get(
			ERoles.Designers
		);

		await interaction.channel
			.edit({
				parent: ECategories.Working,
				name: `claimedby-${interaction.user.username}-${Ticket.ticket_index}`,
				topic: `claimed by: ${interaction.user.toString()}, Discount: ${
					Ticket.coupon ? Ticket.coupon.discount : 0
				}%`,
				permissionOverwrites: [
					...(
						interaction.channel as TextChannel
					).permissionOverwrites.cache.toJSON(),
					{
						id: interaction.user,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: primary_role,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: secondary_role,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			})
			.catch((e) =>
				interaction.reply(
					"Sorry, Something went worng, (editing the channel)"
				)
			);
		Ticket.claimed_by = interaction.user.id;
		Ticket.status = TicketStatus.Claimed;
		await Ticket.save();
		return await interaction.reply({
			ephemeral: true,
			content: "You have successfully claimed the ticket!",
		});
	}
}
