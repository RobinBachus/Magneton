const links = document.getElementsByTagName("a");
const sessionToken = sessionStorage.getItem("session") ?? "testSession";
const user_id = sessionStorage.getItem("user_id") ?? "testUser";

for (let link of links) {
	link.onclick = (e) => {
		if (!sessionToken || !user_id) return;
		const url = link.href;
		if (url === "/") return;
		link.href = `${url}?session=${sessionToken}&user_id=${user_id}`;
	};
}
