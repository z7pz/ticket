import {
	InteractionHandler,
	InteractionHandlerTypes,
	PieceContext,
} from "@sapphire/framework";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	EmbedBuilder,
	PermissionsBitField,
} from "discord.js";
import { EButtonId, ECategories, ERoles } from "../utils";
import { ConfigEntity, TicketEntity } from "../entities";

export class ButtonHandler extends InteractionHandler {
	public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
		super(ctx, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.Button,
		});
	}
	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== EButtonId.OpenTicket) return this.none();
		return this.some();
	}

	public async run(interaction: ButtonInteraction) {
		const message = interaction.message;

		// Supported roles
		const primary_role = message.guild.roles.cache.get(ERoles.Supports);
		const secondary_role = message.guild.roles.cache.get(ERoles.Designers);

		// get tickets config
		const config = await ConfigEntity.increment();

		// Createing the channel
		const ticket_channel = await message.guild.channels.create({
			parent: ECategories.Orders,
			permissionOverwrites: [
				{
					id: interaction.user,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: primary_role,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: secondary_role,
					allow: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: message.guild.roles.everyone,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
			],
			name: `ticket-${config.tickets}`,
			/**
			 * increment the number of ticket
			 */
		});

		// Saving to Database
		await new TicketEntity(ticket_channel.id, config.tickets).save();

		// Action builder for 'claim' and 'close' buttons
		const ticket_buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.ClaimTicket)
					.setLabel("Claim")
					.setStyle(ButtonStyle.Primary)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.DeleteTicket)
					.setLabel("Delete")
					.setStyle(ButtonStyle.Danger)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.LockTicket)
					.setLabel("Lock")
					.setStyle(ButtonStyle.Danger)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.LeaveTicket)
					.setLabel("Leave")
					.setStyle(ButtonStyle.Danger)
			);

		// Embed builder
		const ticket_embed = new EmbedBuilder().setAuthor({
			name: "Welcome to 7br",
		});

		await ticket_channel.send({
			embeds: [ticket_embed],
			//@ts-ignore
			components: [ticket_buttons],
		});

		await interaction.reply({
			content: "Your ticket has been created successfully!",
			ephemeral: true,
		});
	}
}
