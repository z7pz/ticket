import { TicketEntity } from "../entities";

export async function is_ticket(channel_id: string) {
	const ticket = await TicketEntity.findOne({ channel_id });
	if(!ticket) console.log("no ticket!!")
	if (!ticket) return false;
	return true;
}
