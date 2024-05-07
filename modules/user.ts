import { CaughtPokemon } from "../@types/pokemon";

class User {
	public constructor(name: string) {
		this.username = name;
		this._hash = User.HashName(name);
	}

	/** This can be used to do a fast lookup in the database */
	public readonly _hash: number;
	public username: string;
	/** Url to the user's avatar or null if they don't have one */
	public avatar: string | null = null;
	public buddy: CaughtPokemon | null = null;
	/** Contains all the pokemon the user has caught */
	public caught: CaughtPokemon[] = [];

	/** Hashes the name to get a semi-unique identifier for the user
	 * @param name The name of the user
	 * @returns The hash of the name as a 32 bit integer
	 */
	public static HashName(name: string): number {
		let hash = 0;
		for (let i = 0, len = name.length; i < len; i++) {
			let chr = name.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
}
