const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const avatar = document.getElementById("avatar");
const avatarUrl = document.getElementById("avatar-url");

let avatarID = 0;

prevBtn.onclick = () => setUrl(--avatarID);
nextBtn.onclick = () => setUrl(++avatarID);

function setUrl(newId) {
	avatarID = mod(newId, 12);
	const url = `/assets/img/pfp${avatarID + 1}.png`;
	avatarUrl.value = url;
	avatar.src = url;
}

/**
 * Returns the non truncating modulo of n mod m
 * @param {number} n base number
 * @param {number} m modulo
 * @returns {number} n mod m
 * @example mod(-1, 5) // 4
 */
function mod(n, m) {
	return ((n % m) + m) % m;
}
