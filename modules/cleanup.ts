import { DataBase } from "./database";

const events = [
	`exit`,
	`SIGINT`,
	`SIGUSR1`,
	`SIGUSR2`,
	`uncaughtException`,
	`SIGTERM`,
];

export class CleanUp {
	private _database: DataBase;
	private _exitCode: number = 0;

	constructor(database: DataBase) {
		this._database = database;
		this._addListeners();
	}

	private _addListeners() {
		events.forEach((eventType) => {
			if (eventType === "uncaughtException") {
				process.on(eventType, async (err) => {
					console.error(err);
					this._exitCode = 1;
					await this._cleanUp(eventType);
				});
				return;
			}
			process.on(eventType, async () => await this._cleanUp(eventType));
		});
	}

	private _removeListeners() {
		events.forEach((eventType) => {
			process.removeAllListeners(eventType);
		});
	}

	private async _cleanUp(eventType?: string) {
		if (eventType) {
			console.log(`CleanUp: Received signal: ${eventType}`);
		}

		console.log("CleanUp: Cleaning up...");

		await this._database.close();

		console.log("CleanUp: Cleanup complete");
		this._removeListeners();
		process.exit(this._exitCode);
	}
}
