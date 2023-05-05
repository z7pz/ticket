import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: "rateLimit",
		});
	}

	run(client: any) {
		console.log(client);
	}
}
