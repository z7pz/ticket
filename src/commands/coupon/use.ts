import { Args, Command } from "@sapphire/framework";
import type { Message, TextChannel } from "discord.js";
import { CouponEntity, TicketEntity } from "../../entities";

export class TestCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "use",
			aliases: [],
		});
	}

	public async messageRun(message: Message, args: Args) {
		const codeResult = await args.pickResult("string");
		return await codeResult.match({
			ok: async (code: string): Promise<any> => {
				const coupon = await CouponEntity.findOne({ code });
				if (!coupon)
					return message.reply("Sorry, this coupon not found.");
				const tickets = await coupon.tickets.init();
				if (tickets.length >= coupon.use_limit)
					return message.reply("Sorry, this coupon is used.");
				const ticket = await TicketEntity.findOne({
					channel_id: message.channel.id,
				});
				if (ticket.coupon)
					return message.reply(
						"Sorry, you already used a coupon for this ticket."
					);
				ticket.coupon = coupon;
				await ticket.save();
				await message.reply(
					`\`${coupon.discount}%\`, code has been set successfully for this ticket!`
				);
				if (ticket.claimed_by) {
					await (message.channel as TextChannel).edit({
						topic: `claimed by: <@${ticket.claimed_by}>, Discount: ${coupon.discount}%`,
					});
				}
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
