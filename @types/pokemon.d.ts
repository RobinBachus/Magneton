import { types } from "util";

export interface Pokemon {
	id: number;
	name: string;
	stats: Stats;
	shiny: boolean;
	url: string;
	icon: string;
	sprite: string;
	backSprite: string;
	types: PokemonType[];
}

export interface Stats {
	hp: number;
	attack: number;
	defense: number;
	specialAttack: number;
	specialDefense: number;
	speed: number;
}

export interface CaughtPokemon extends Pokemon {
	level: number;
}

export enum PokemonType {
	normal,
	fire,
	water,
	electric,
	grass,
	ice,
	fighting,
	poison,
	ground,
	flying,
	psychic,
	bug,
	rock,
	ghost,
	dragon,
	dark,
	steel,
	fairy,
}
