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
import { ConfigEntity, TicketEntity, TicketStatus } from "../entities";

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

	public async run(interaction: ButtonInteraction): Promise<any> {
		const message = interaction.message;

		// check if user has active ticket
		const t = await TicketEntity.findOne({
			user_id: interaction.user.id,
			status: TicketStatus.Orders,
		});
		if (t && interaction.guild.channels.cache.get(t.channel_id)) {
			return await interaction.reply({
				content: "Sorry, you can't open two tickets at the same time.",
				ephemeral: true,
			});
		}

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
		});

		// Saving to Database
		await new TicketEntity(
			ticket_channel.id,
			interaction.user.id,
			config.tickets
		).save();

		// Action builder for 'claim' and 'close' buttons
		const ticket_buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.ClaimTicket)
					.setLabel("استلام")
					.setStyle(ButtonStyle.Success)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.LeaveTicket)
					.setLabel("ترك")
					.setStyle(ButtonStyle.Danger)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.LockTicket)
					.setLabel("قفل")
					.setStyle(ButtonStyle.Secondary)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId(EButtonId.DeleteTicket)
					.setLabel("حذف")
					.setStyle(ButtonStyle.Danger)
			);

		await ticket_channel.send({
			content: `https://gfycat.com/idlefastduckbillcat`,
			//@ts-ignore
			components: [ticket_buttons],
		});

		await ticket_channel.send({
			content: `${primary_role}, ${secondary_role}`,
		});

		await interaction.reply({
			content: `تم أنشاء تذكرتك بنجاح. ${ticket_channel}`,
			ephemeral: true,
		});
	}
}
