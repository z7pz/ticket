import { PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class Base {
	@PrimaryKey({ type: "string" })
	_id: ObjectId = new ObjectId();

	@Property({ type: "date" })
	createdAt: Date = new Date();

	@Property({ onUpdate: () => new Date(), type: "date" })
	updatedAt: Date = new Date();
}
