function generateRGBColor() {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
}

function randomizePosition(element) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Generate random positions
  const randomX = Math.random() * (viewportWidth - element.offsetWidth);
  const randomY = Math.random() * (viewportHeight - element.offsetHeight);

  // Set new positions
  element.style.left = `${randomX}px`;
  element.style.top = `${randomY}px`;
}

function generateButton(color) {
  const div = document.createElement("div");
  div.classList.add("button");
  div.style.backgroundColor = color;
  randomizePosition(div);
  div.addEventListener("click", () => {
    alert("You clicked me!");
  });
  document.body.appendChild(div);
}

const BUTTONS_COUNT = 12;

for (let i = 0; i < BUTTONS_COUNT; i++) {
  const color = generateRGBColor();
  generateButton(color);
}
