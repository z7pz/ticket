import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class ReadyListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			once: true,
			event: "ready",
		});
	}

	run(client: Client) {
		console.log(`${client.user.tag} has been logged in!`);
	}
}
