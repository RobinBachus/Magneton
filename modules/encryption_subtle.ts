import crypto from "crypto";
import public_key from "../certs/public_key.json";
import private_key from "../certs/private_key.json";
import { webcrypto } from "crypto";

const subtle = crypto.webcrypto.subtle;

let publicKey: CryptoKey;
let privateKey: CryptoKey;

(async () => {
	publicKey = await importKey(public_key);
	privateKey = await importKey(private_key);
})();

// This is used for turning a string into a stream (like a list kind of) of bytes
// Just used for encryption
const enc = new TextEncoder();
// Takes a byte stream and turns it back into a string
const dec = new TextDecoder("utf-8");

/**
 * Imports a CryptoKey from a JSON file
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey importKey()}: Info about the subtle.importKey() function
 * @param keyData The JSON file containing the key
 * @returns The imported key
 */
async function importKey(keyData: { ext: boolean; key_ops: string[] }) {
	return await subtle.importKey(
		"jwk",
		keyData as unknown as JsonWebKey,
		{ name: "RSA-OAEP", hash: "SHA-256" },
		keyData.ext,
		keyData.key_ops as webcrypto.KeyUsage[]
	);
}

/**
 * Encrypts a string using the Crypto interface
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto Crypto interface} Crypto docs
 * @see {@link  https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#rsa-oaep RSA-OAEP} Algorithm I used for encryption
 * @param str The text to encrypt
 * @returns A promise for the encrypted text buffer encoded as a string
 */
export async function encrypt(str: string) {
	const data = enc.encode(str);

	// I'm using the RSA-OAEP algorithm because it's the easiest to implement :3
	const encrypted = await subtle.encrypt(
		{ name: "RSA-OAEP" },
		publicKey,
		data
	);

	// Convert the arraybuffer to a string for easy storage
	return bufferToString(encrypted);
}

/**
 * Decrypts a string received from the {@link encrypt encrypt()} function
 * @param encryptedStr The encrypted string to decode
 * @returns The decoded plaintext string or null if decryption was unsuccessful
 */
export async function decrypt(encryptedStr: string) {
	// TODO: Better error handling
	try {
		const decrypted = await subtle.decrypt(
			{ name: "RSA-OAEP" }, // Same as encrypt
			privateKey,
			stringToUint8Array(encryptedStr) // Turn the storable string back into a buffer
		);

		return dec.decode(decrypted);
	} catch (e) {
		console.log(e);
		// If unable to decrypt, return null
		return null;
	}
}

// These two functions are taken from here: https://discourse.mozilla.org/t/efficient-storage-of-arraybuffer-uint8array/59698/3
function bufferToString(buf: ArrayBuffer) {
	return String.fromCharCode(...new Uint8Array(buf));
}

function stringToUint8Array(str: string) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}
