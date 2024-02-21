import public_key from "../assets/json/public_key.json" assert { type: "json" };
// TODO: Move the private key to the server side as fast as possible
import private_key from "../assets/json/private_key.json" assert { type: "json" };

/* ================== !!!!! ==================
 You can hover over most functions and see a 
 link to the MDN reference with more info.
===================== !!!!! ================== */

const subtle = window.crypto.subtle;

/**
 * Imports a CryptoKey from a JSON file
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey importKey()}: Info about the subtle.importKey() function
 * @param {{"ext":string, "key_ops": string[]}} keyData The JSON file containing the key
 * @returns The imported key
 */
const importKey = async (keyData) =>
	await subtle.importKey(
		"jwk",
		keyData,
		{ name: "RSA-OAEP", hash: "SHA-256" },
		keyData.ext,
		keyData.key_ops
	);

// Get the 2 keys from their json files
const publicKey = await importKey(public_key);
const privateKey = await importKey(private_key);

// This is used for turning a string into a stream (like a list kind of) of bytes
// Just used for encryption
const enc = new TextEncoder();
// Takes a byte stream and turns it back into a string
const dec = new TextDecoder("utf-8");

/**
 * Encrypts a string using the Crypto interface
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto Crypto interface} Crypto docs
 * @see {@link  https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#rsa-oaep RSA-OAEP} Algorithm I used for encryption
 * @param {string} str The text to encrypt
 * @returns A promise for the encrypted text buffer encoded as a string
 */
export async function encrypt(str) {
	const data = enc.encode(str);

	// I'm using the RSA-OAEP algorithm because it's the easiest to implement
	const encrypted = await subtle.encrypt(
		{
			name: "RSA-OAEP",
		},
		publicKey,
		data
	);

	// Convert the arraybuffer to a string for easy storage
	return bufferToString(encrypted);
}

/**
 * Decrypts a string received from the {@link encrypt encrypt()} function
 * @param {string} encryptedStr The encrypted string to decode
 * @returns The decoded plaintext string or null if decryption was unsuccessful
 */
export async function decrypt(encryptedStr) {
	// TODO: Better error handling
	try {
		const decrypted = await subtle.decrypt(
			// Same as encrypt
			{
				name: "RSA-OAEP",
			},
			privateKey,
			// Turn the storable string back into a buffer
			stringToUint8Array(encryptedStr)
		);

		return dec.decode(decrypted);
	} catch (e) {
		console.log(e);
		// If unable to decrypt, return null
		return null;
	}
}

// These two functions are taken from here: https://discourse.mozilla.org/t/efficient-storage-of-arraybuffer-uint8array/59698/3
function bufferToString(buf) {
	return String.fromCharCode(...new Uint8Array(buf));
}

function stringToUint8Array(str) {
	const buf = new ArrayBuffer(str.length);
	const bufView = new Uint8Array(buf);
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i);
	}
	return bufView;
}
