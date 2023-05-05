import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { CouponEntity } from "../../entities";

export class TestCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "generate",
			aliases: ["gen"],
			requiredUserPermissions: ["Administrator"],
		});
	}
	public async messageRun(message: Message, args: Args) {
		const discountResult = await args.pickResult("number");
		return await discountResult.match({
			ok: async (discount: number) => {
				const useLimitResult = await args.pickResult("number");
				return await useLimitResult.match({
					ok: async (use_limit: number) => {
						const coupon = new CouponEntity(discount, use_limit);
						await coupon.save();
						return message.reply(
							`Coupon has been created successfully \`${coupon.code}\` (${coupon.discount}%) for ${coupon.use_limit} tickets.`
						);
					},
					err: (err: any) =>
						message.channel
							.send("" + err)
							.catch(
								() =>
									void message.channel.send(
										"Something went wrong"
									)
							),
				});
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
