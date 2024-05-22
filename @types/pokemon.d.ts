export interface Pokemon {
	id: number;
	name: string;
	stats: Stats;
	shiny: boolean;
	url: string;
	icon: string;
	sprite: string;
	backSprite: string;
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
