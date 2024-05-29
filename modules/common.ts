export enum StatusCode {
	success = 0,
	dbMissingCredentials = 1000,
	dbConnectionError = 1001,
}

export function success(status: StatusCode): boolean;
export function success<T>(status: TResult<T>): boolean;
export function success<T>(status: StatusCode | TResult<T>): boolean {
	if (typeof status === "number") return status === StatusCode.success;
	return status.status === StatusCode.success;
}

export function failed(status: StatusCode): boolean;
export function failed<T>(status: TResult<T>): boolean;
export function failed<T>(status: StatusCode | TResult<T>): boolean {
	if (typeof status === "number") return status !== StatusCode.success;
	return status.status !== StatusCode.success;
}

export type TResult<T> = {
	result: T | null;
	status: StatusCode;
};

export enum Modifier {
	none = "",
	reset = "\x1b[0m",
	bright = "\x1b[1m",
	dim = "\x1b[2m",
	underscore = "\x1b[4m",
	blink = "\x1b[5m",
	reverse = "\x1b[7m",
	hidden = "\x1b[8m",
}

export enum FgColor {
	black = "\x1b[30m",
	red = "\x1b[31m",
	green = "\x1b[32m",
	yellow = "\x1b[33m",
	blue = "\x1b[34m",
	magenta = "\x1b[35m",
	cyan = "\x1b[36m",
	white = "\x1b[37m",
	gray = "\x1b[90m",
	crimson = "\x1b[38m", // Scarlet
}

export enum BgColor {
	black = "\x1b[40m",
	red = "\x1b[41m",
	green = "\x1b[42m",
	yellow = "\x1b[43m",
	blue = "\x1b[44m",
	magenta = "\x1b[45m",
	cyan = "\x1b[46m",
	white = "\x1b[47m",
	gray = "\x1b[100m",
	crimson = "\x1b[48m",
}

export type TColor = Modifier | FgColor | BgColor;

export const Color = {
	modifier: { ...Modifier },
	fg: { ...FgColor },
	bg: { ...BgColor },
};

export function colorize(text: string, color: TColor): string;
export function colorize(text: string, fg: FgColor, bg: BgColor): string;
export function colorize(
	text: string,
	fg: TColor,
	bg: TColor = Modifier.none
): string {
	return `${fg}${bg}${text}${Color.modifier.reset}`;
}

/**
 * An extended version of the colorize function that allows for multiple colors and modifiers to be applied to the text.
 * @param text The text to colorize
 * @param colors The colors and modifiers to apply to the text
 * @returns The modified text
 */
export function colorizeExt(text: string, ...colors: TColor[]): string {
	return colors.reduce((acc, color) => colorize(acc, color), text);
}

export function toUniqueArray<T>(array: T[]): T[] {
	return [...new Set(array)];
}

export function includesAny<T>(array: T[], ...values: T[]): boolean {
	return values.some((value) => array.includes(value));
}
