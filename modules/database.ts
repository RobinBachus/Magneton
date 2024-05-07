import { MongoClient } from "mongodb";
import { CollectionType, DbCollections, DbUser } from "../@types/db";
import { EventEmitter } from "events";

export class DataBase extends EventEmitter {
	client: MongoClient;
	collections: DbCollections = { users: null };
	ready: boolean = false;

	constructor(uri: string, certs: string) {
		super();

		this.client = new MongoClient(uri, {
			tlsCertificateKeyFile: certs,
		});
	}

	async connect() {
		try {
			await this.client.connect();

			const userCollection = this.client
				.db("Users")
				.collection<DbUser>("VerifiedUsers");

			this.collections.users = userCollection;

			this._setReady();
		} catch (e) {
			console.error(e);
			this.close();
		}
	}

	async upsert<T extends keyof DbCollections>(
		collection: T,
		query: Partial<CollectionType<T>>,
		data: Partial<CollectionType<T>>
	) {
		const _collection = this.collections[collection];
		if (!_collection) {
			console.error(`Collection ${collection} not found`);
			return null;
		}

		return await _collection.updateOne(
			query,
			{ $set: data },
			{ upsert: true }
		);
	}

	async update<T extends keyof DbCollections>(
		collection: T,
		query: Partial<CollectionType<T>>,
		data: Partial<CollectionType<T>>
	) {
		const _collection = this.collections[collection];
		if (!_collection) {
			console.error(`Collection ${collection} not found`);
			return null;
		}

		return await _collection.updateOne(query, { $set: data });
	}

	async close() {
		await this.client.close();
		this._setReady(false);
		console.log("Database connection closed");
	}

	onReady(callback: () => void) {
		this.on("ready", callback);
	}

	offReady(callback: () => void) {
		this.off("ready", callback);
	}

	private _setReady(val: boolean = true) {
		this.ready = val;
		if (val) {
			this.emit("ready");
		}
	}
}
