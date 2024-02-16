import public_key from "../assets/json/public_key.json" assert { type: "json" };
// TODO: Move the private key to the server side as fast as possible
import private_key from "../assets/json/private_key.json" assert { type: "json" };

const subtle = window.crypto.subtle;

/**
 * Imports a CryptoKey from a JSON file
 * @param {{"ext":string, "key_ops": string[]}} key
 * @returns {Promise<CryptoKey>} The imported key
 */
const importKey = async (key) =>
	await subtle.importKey(
		"jwk",
		key,
		{ name: "RSA-OAEP", hash: "SHA-256" },
		key.ext,
		key.key_ops
	);

const publicKey = await importKey(public_key);
const privateKey = await importKey(private_key);

const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");

export async function encrypt(str) {
	const data = enc.encode(str);

	const encrypted = await subtle.encrypt(
		{
			name: "RSA-OAEP",
		},
		publicKey,
		data
	);

	return bufferToString(encrypted);
}

export async function decrypt(encryptedStr) {
	try {
		const decrypted = await subtle.decrypt(
			{
				name: "RSA-OAEP",
			},
			privateKey,
			stringToUint8Array(encryptedStr)
		);

		return dec.decode(decrypted);
	} catch (e) {
		console.log(e);
	}
}

// These two functions are taken from here: https://discourse.mozilla.org/t/efficient-storage-of-arraybuffer-uint8array/59698/3
export function bufferToString(buf) {
	return String.fromCharCode(...new Uint8Array(buf));
}

export function stringToUint8Array(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}
