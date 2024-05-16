const tokenIndex = document.location.search.indexOf("session=") + 8;
if (tokenIndex) {
	const token = document.location.search.substring(tokenIndex, 60);
	sessionStorage.setItem("session", token);
}

const links = document.getElementsByTagName("a");
const sessionToken = sessionStorage.getItem("session");

console.log(sessionToken);

for (let link of links) {
	link.onclick = (e) => {
		if (!sessionToken) return;
		const url = link.href;
		console.log(link.href);
		if (url === "/") return;
		link.href = `${url}?session=${sessionToken}`;
	};
}
