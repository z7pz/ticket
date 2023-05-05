import { Command } from "@sapphire/framework";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Message,
} from "discord.js";
import { EButtonId } from "../utils";

export class SendCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			name: "send",
			aliases: [],
		});
	}

	public async messageRun(message: Message) {
		await message.channel.send({
			files: [
				"https://cdn.discordapp.com/attachments/868104650228891648/1104166216840523906/0d77cee1596691c0.png",
			],
		});

		await message.channel.send({
			files: [
				"https://cdn.discordapp.com/attachments/868104650228891648/1104166648631537774/b8bc1d76780eb7fc.png",
			],
		});

		await message.channel.send(`> شروط خادم حِبْر : - 

		- الدفع مُسبق ولا يمكننا العمل مجاناََ .
		- بمجرد دفع المبلغ ، لا يمكن إلغاء الخدمه .
		- لسنا مسؤولين عن آية مشكلات تتعلق بالدفع .
		- التصميم المُقدم نهائي ، وأي تعديل سيكلفك الأمر سعراََ مختلفاََ .`);

		await message.channel.send({
			files: [
				"https://cdn.discordapp.com/attachments/868104650228891648/1104166648631537774/b8bc1d76780eb7fc.png",
			],
		});

		const Button = new ActionRowBuilder().setComponents(
			new ButtonBuilder() // Create the button inside of an action Row
				.setCustomId(EButtonId.OpenTicket)
				.setEmoji({ id: "1070512068249272461" })
				.setStyle(ButtonStyle.Secondary)
		);

		await message.channel.send({
			content: "**يمكنك فتح تذكرة من عبر <:7br:1070512068249272461>**\n",
			//@ts-ignore
			components: [Button],
		});
	}
}
