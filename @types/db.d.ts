import { BSON, Collection, ObjectId } from "mongodb";
import { CaughtPokemon } from "./pokemon";

// This is a utility type that gets the inner type of a Collection
type GetInnerType<S> = S extends Collection<infer T> ? T : never;

/**
 * This will return the document type of a collection
 * @example
 * type DbUser = CollectionType<"users">;
 */
export type CollectionType<T extends keyof DbCollections> = GetInnerType<
	DbCollections[T]
>;

export interface DbCollections {
	users: Collection<DbUser> | null;
}

export interface DbUser extends BSON.Document {
	username: string;
	hashed_pass: string;
	avatar: string | null;
	buddy: CaughtPokemon | null;
	caught: CaughtPokemon[];
	session: DbSession | null;
	_id?: ObjectId;
}

export interface DbSession {
	token: string;
	/** UTC timestamp */
	creation: number;
	/** UTC timestamp */
	expiration: number;
	known_ips: string[];
}

interface LoginData {
	email: string;
	password: string;
	ip?: string;
}
