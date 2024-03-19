/** @type HTMLFormElement */
const guessForm = document.getElementById("guess-form");
const guessOptions = document.querySelectorAll(".guess-option");
const guessImage = document.getElementById("guess-img");

guessForm.onsubmit = (e) => submit(e.target);

guessOptions.forEach((option) => {
	option.addEventListener("click", (e) => {
		guessForm.elements.guess.value = e.target.textContent;
		submit(guessForm);
	});
});

/**
 * Submit logic for the quiz form
 * @param {HTMLFormElement} e
 */
function submit(e) {
	const guess = e.elements.guess.value;
	console.log("Guessed: ", guess);

	if (guess === "Charizard") guessImage.classList.add("guessed");
}

// stops the user from seeing the image by dragging it
guessImage.ondragstart = function () {
	return false;
};
