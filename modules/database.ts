import { MongoClient } from "mongodb";

export class DataBase {
	client: MongoClient;
	ready: boolean = false;

	constructor(uri: string, certs: string) {
		this.client = new MongoClient(uri, {
			tlsCertificateKeyFile: certs,
		});

		try {
			this.client.connect();
			const database = this.client.db("testDB");
			const collection = database.collection("testCol");
			console.log("Database connected");
		} finally {
			this.client.close();
		}
	}
}
