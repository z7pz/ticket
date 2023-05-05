import {
	Entity,
	FilterQuery,
	FindOptions,
	Loaded,
	Property,
	SerializedPrimaryKey,
} from "@mikro-orm/core";
import { Base } from ".";
import { orm } from "..";

@Entity({ tableName: "Config" })
export class ConfigEntity extends Base {
	@Property({ type: "string" })
	config_id!: string;

	@Property({ type: "numeric" })
	tickets: number = 0;

	constructor(config_id: string) {
		super();
		this.config_id = config_id;
	}

	static async increment(config_id = "root") {
		const config = await this.get(config_id);
		config.tickets += 1;
		await config.save();
		return config;
	}
	static async get(config_id = "root"): Promise<Loaded<ConfigEntity, never>> {
		const config = await ConfigEntity.findOne({ config_id });
		if (!config) {
			await new ConfigEntity(config_id).save();
			return await ConfigEntity.get();
		}
		return config;
	}

	static async findOne(
		query: FilterQuery<ConfigEntity>,
		options?: FindOptions<ConfigEntity, never>
	) {
		const em = orm.em.fork();
		const repo = em.getRepository(ConfigEntity);
		return await repo.findOne(query, options);
	}

	async save() {
		const em = orm.em.fork();
		return await em.persistAndFlush([this]);
	}
}
