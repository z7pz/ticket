import {
	Entity,
	FilterQuery,
	FindOptions,
	ManyToOne,
	Property,
} from "@mikro-orm/core";
import { Base, CouponEntity } from ".";
import { orm } from "..";

@Entity({ tableName: "Ticket" })
export class TicketEntity extends Base {
	@Property({ type: "string" })
	channel_id!: string;

	@Property({ type: "numeric" })
	ticket_index!: number;

	@Property({ type: "string", nullable: true })
	claimed_by?: string; // user id

	@ManyToOne(() => CouponEntity, { nullable: true })
	coupon?: CouponEntity;

	constructor(channel_id: string, ticket_index: number) {
		super();
		this.channel_id = channel_id;
		this.ticket_index = ticket_index;
	}

	static async findOne(
		query: FilterQuery<TicketEntity>,
		options?: FindOptions<TicketEntity, never>
	) {
		const em = orm.em.fork();
		const repo = em.getRepository(TicketEntity);
		return await repo.findOne(query, options);
	}

	async save() {
		const em = orm.em.fork();
		return await em.persistAndFlush([this]);
	}
}
