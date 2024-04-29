export interface Pokemon {
	name: string;
	stats: {
		hp: number;
		attack: number;
		defense: number;
		specialAttack: number;
		specialDefense: number;
		speed: number;
	};

	url: string;
	thumbnail: string;
	image: string;
}

export interface CaughtPokemon extends Pokemon {
	level: number;
}
