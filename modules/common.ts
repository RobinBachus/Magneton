export function unique<T>(this: T[]): T[] {
	return [...new Set(this)];
}

declare global {
	interface Array<T> {
		unique(): T[];
	}
}

Array.prototype.unique = unique;
