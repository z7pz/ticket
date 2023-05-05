import {
	Collection,
	Entity,
	FilterQuery,
	FindOptions,
	OneToMany,
	Property,
} from "@mikro-orm/core";
import { Base, TicketEntity } from ".";
import { orm } from "..";

@Entity({ tableName: "Coupon" })
export class CouponEntity extends Base {
	@Property({ type: "string" })
	code!: string;

	@Property({ type: "numeric" })
	discount!: number;

	@Property({ type: "numeric" })
	use_limit!: number;

	@Property({ type: "numeric" })
	usage: number = 0;

	@OneToMany(() => TicketEntity, (ticket) => ticket.coupon)
	tickets = new Collection<TicketEntity>(this);

	constructor(discount: number, use_limit: number = 1) {
		super();
		this.code = "7br-" + this.create_code();
		this.discount = discount;
		this.use_limit = use_limit;
	}

	private create_code(len = 5) {
		let code = "";
		let nums = "0123456789";
		let lower = "abcdefghijklmnopqrstuvwxyz";
		let upper = lower.toUpperCase();
		let chars = lower + upper + nums;
		for (let i = 0; i < len; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	}

	static async findOne(
		query: FilterQuery<CouponEntity>,
		options?: FindOptions<CouponEntity, never>
	) {
		const em = orm.em.fork();
		const repo = em.getRepository(CouponEntity);
		return await repo.findOne(query, options);
	}

	async save() {
		const em = orm.em.fork();
		return await em.persistAndFlush([this]);
	}
}
