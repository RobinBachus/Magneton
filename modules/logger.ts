import { Color, TColor, colorize, colorizeExt } from "./common";
import { EventEmitter } from "events";

export type TError = Error | string;

/**
 * A class to handle logging and error handling.
 *
 * @extends EventEmitter - Adds event emitting functionality
 *
 * @abstract
 */
export default abstract class Logger extends EventEmitter {
	private _process: string;
	private _color: TColor;

	/**
	 * Create a new instance of the Logger class.
	 * @param process The name of the process
	 * @param color The color to use for the process name
	 */
	constructor(process: string, color: TColor) {
		super();

		this._process = process;
		this._color = color;
	}

	log(message: string) {
		Logger.log(message, this._process, this._color);
	}

	error(error: TError) {
		Logger.error(this._process, error, this._color);
		this.emit("error", error);
	}

	/**
	 * Log a message to the console.
	 * @param message The message to log
	 * @param process The name of the process (default: "general")
	 * @param processColor The color to use for the process name (default: gray)
	 */
	static log(
		message: string,
		process: string = "general",
		processColor: TColor = Color.fg.gray
	) {
		const prefix = colorize(process, processColor);
		console.log(`${prefix}: ${message}`);
	}

	static error(
		process: string,
		error: TError,
		processColor: TColor = Color.fg.red
	) {
		const prefix = colorize(process, processColor);
		const message = error instanceof Error ? `\n${error.stack}` : error;
		console.error(
			`${prefix}: Error! ${colorizeExt(message, Color.fg.red)}`
		);
	}

	override on(event: "error", listener: (error: TError) => void): this;
	override on(event: string | symbol, listener: (...args: any) => void): this;
	override on(event: string | symbol, listener: (...args: any) => void) {
		return super.on(event, listener);
	}

	override emit(event: "error", error: TError): boolean;
	override emit(event: string | symbol, ...args: any): boolean;
	override emit(event: string | symbol, ...args: any) {
		return super.emit(event, args);
	}
}
