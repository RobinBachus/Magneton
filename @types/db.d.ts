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

export interface DbUser extends BSON.Document, SecureUser {
	_id?: ObjectId;
	hashed_pass: string;
}

export interface SecureUser {
	_id?: never | ObjectId;
	hashed_pass?: never | string;
	email: string;
	username: string;
	avatar: string;
	buddy: CaughtPokemon | null;
	caught: CaughtPokemon[];
}

/** This is the old session type that was used in the database. We are now using express-session
 * @deprecated
 */
export interface DbSession {
	token: string;
	/** UTC timestamp */
	creation: number;
	/** UTC timestamp */
	expiration: number;
}

interface LoginData {
	email: string;
	username:string;
	password: string;
	avatar: string;
}
