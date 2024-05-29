import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { CollectionType, DbCollections, DbUser } from "../@types/db";
import { Color, StatusCode, TResult } from "./common";
import Logger from "./logger";

dotenv.config();

/**
 * A class to handle database connections and queries.
 *
 * To create a new instance of the Database class, use the static {@link create} method.
 * ---
 * ---
 * @extends Logger - Adds logging and event emitting functionality
 * ---
 * @event ready - Emitted when the database is ready to be used
 * @event close - Emitted when the database connection is closed
 */
export default class Database extends Logger {
	client: MongoClient;
	collections: DbCollections = { users: null };
	ready: boolean = false;

	private static readonly _color = Color.fg.cyan;

	private constructor(uri: string, credentials: string) {
		super("Database", Database._color);

		this.client = new MongoClient(uri, {
			tlsCertificateKeyFile: credentials,
		});
	}

	/**
	 * Create a new instance of the Database class and open a connection.
	 * @returns A new instance of the Database class
	 */
	static async create(): Promise<TResult<Database>> {
		const uri = process.env.DATABASE_URI;
		const credentials = process.env.DATABASE_CERT;

		if (!uri || !credentials) {
			Logger.error(
				"Missing database credentials",
				"Database",
				Database._color
			);

			return {
				result: null,
				status: StatusCode.dbMissingCredentials,
			};
		}

		const database = new Database(uri, credentials);

		database.onReady(() => {
			database.log("Database is ready");
		});

		try {
			await database.connect();
		} catch (error: any) {
			database.error(error);
			if (database.ready) database.close();
			return { result: null, status: StatusCode.dbConnectionError };
		}

		return { result: database, status: StatusCode.success };
	}

	// TODO: return success/failure
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
		this.log("Database connection closed");
	}

	onReady(callback: () => void) {
		this.on("ready", callback);
	}

	offReady(callback: () => void) {
		this.off("ready", callback);
	}

	private _setReady(val: boolean = true) {
		this.ready = val;
		if (val) this.emit("ready");
	}
}
