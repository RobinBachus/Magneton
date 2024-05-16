import { Color, TColor, colorize, colorizeExtended } from "./common";
import { EventEmitter } from "events";

export default abstract class Logger extends EventEmitter {
	private _process: string;
	private _color: TColor;

	constructor(process: string, color: TColor) {
		super();

		this._process = process;
		this._color = color;
	}

	log(message: string) {
		const prefix = colorize(this._process, this._color);
		console.log(`${prefix}: ${message}`);
	}

	error(error: Error) {
		const prefix = colorize(this._process, this._color);
		const stack = colorizeExtended(`${error.stack}`, Color.fg.red);
		console.error(`${prefix}: Error! \n${stack}`);
	}
}
