const state = {
  isMouseGridOpen: false,
  keysPressed: [],
  potentialTiles: [],
  proximityRadius: 1,
  toggleMouseGrid: () => {
    state.isMouseGridOpen = !state.isMouseGridOpen;
  },
};

const GRID = document.querySelector(".mouse_grid");

function handleKeyPresses(e) {
  if (!state.isMouseGridOpen) return;

  const keyPressed = e.key.toUpperCase();

  if (keyPressed === "ENTER") {
    if (state.potentialTiles.length === 1) {
      const selectedTile = state.potentialTiles[0];
      moveMouseToTile(selectedTile); // Move the mouse
      selectedTile.click(); // Simulate a click
      resetState(); // Reset state after a successful action
    } else {
      console.warn("Cannot finalize: Multiple or no tiles remain.");
    }
    return;
  }

  if (state.keysPressed.length === 0) {
    // First key press: populate potentialTiles with matching tiles
    state.potentialTiles = Array.from(
      document.querySelectorAll(`.key_${keyPressed}`)
    );

    if (state.potentialTiles.length === 0) {
      console.warn("No tiles match the first key press.");
      return;
    }

    highlightTiles(state.potentialTiles);
  } else {
    // Subsequent key presses: refine the potentialTiles
    const filteredTiles = filterByProximityAndKey(
      state.potentialTiles,
      keyPressed
    );

    if (filteredTiles.length === 0) {
      console.warn("No matching tiles found for the given key.");
    } else {
      state.potentialTiles = filteredTiles;
      highlightTiles(state.potentialTiles);
      state.proximityRadius++;
    }
  }

  state.keysPressed.push(keyPressed); // Add pressed key to the state
}

function filterByProximityAndKey(tiles, keyPressed) {
  if (tiles.length === 0) return [];

  const centerTile = tiles[0]; // The first tile becomes the center
  const centerRow = parseInt(centerTile.dataset.row);
  const centerCol = parseInt(centerTile.dataset.col);

  return tiles.filter((tile) => {
    if (tile.textContent.toUpperCase() !== keyPressed) return false;

    const tileRow = parseInt(tile.dataset.row);
    const tileCol = parseInt(tile.dataset.col);

    return (
      Math.abs(centerRow - tileRow) <= state.proximityRadius &&
      Math.abs(centerCol - tileCol) <= state.proximityRadius
    );
  });
}

function highlightTiles(tiles) {
  removeHighlight(document.querySelectorAll(".highlight"));

  tiles.forEach((tile) => {
    tile.classList.add("highlight");
  });
}

function removeHighlight(tiles) {
  tiles.forEach((tile) => {
    tile.classList.remove("highlight");
  });
}

function moveMouseToTile(tile) {
  const rect = tile.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Simulate mouse movement and click
  const mouseMoveEvent = new MouseEvent("mousemove", {
    clientX: x,
    clientY: y,
  });
  const mouseClickEvent = new MouseEvent("click", {
    clientX: x,
    clientY: y,
  });

  document.dispatchEvent(mouseMoveEvent);
  document.dispatchEvent(mouseClickEvent);

  console.log(`Mouse moved to (${x}, ${y}) and clicked.`);
}

function resetState() {
  state.keysPressed = [];
  state.potentialTiles = [];
  state.proximityRadius = 1;
  removeHighlight(document.querySelectorAll(".highlight"));
}

function showOrHideMouseGrid() {
  const mouseGrid = document.querySelector(".mouse_grid");
  state.isMouseGridOpen
    ? (mouseGrid.style.display = "grid")
    : (mouseGrid.style.display = "none");
}

function generateRandomCharacter() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function makeGridItem(grid, row, col) {
  const div = document.createElement("div");
  const key = generateRandomCharacter();
  div.classList.add("mouse_grid_tile");
  div.classList.add(`key_${key}`);
  div.textContent = key;
  div.dataset.row = row;
  div.dataset.col = col;
  grid.appendChild(div);
}

function generateGrid(grid, tileWidth = 18) {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate the number of rows and columns
  const columns = Math.ceil(viewportWidth / tileWidth);
  const rows = Math.ceil(viewportHeight / tileWidth);

  // clear the grid
  grid.innerHTML = "";

  // populate the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      makeGridItem(grid, row, col);
    }
  }
}

(function init() {
  // generate grid with random characters
  generateGrid(GRID, 18);
  // show and hide the grid when the user presses ctrl + `
  document.addEventListener("keydown", (e) => {
    // listen for ctrl + ` key
    if (e.ctrlKey && e.key === "`") {
      state.toggleMouseGrid();
      showOrHideMouseGrid();
    }

    // Handle keypress interaction
    if (!e.ctrlKey) handleKeyPresses(e);
  });
  // resize the grid when the window is resized
  window.addEventListener("resize", () => {
    generateGrid(GRID, 18);
  });
})();
