const state = {
  isMouseGridOpen: false,
  centerTile: null,
  proximityRadius: 1,
  keysPressed: [],
  potentialTiles: [],
  toggleMouseGrid: () => {
    state.isMouseGridOpen = !state.isMouseGridOpen;
    resetState(this);
  },
};

const GRID = document.querySelector(".mouse_grid");

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

function handleKeyPresses(e) {
  if (!state.isMouseGridOpen) return;

  const keyPressed = e.key.toUpperCase();

  if (keyPressed === "ENTER") {
    // Finalize selection when "ENTER" is pressed
    if (state.potentialTiles.length === 1) {
      const selectedTile = state.potentialTiles[0];
      moveMouseToTile(selectedTile);
      selectedTile.click();
    }
    resetState(state);
  } else {
    if (state.keysPressed.length === 0) {
      // First key press: highlight all matching tiles
      state.potentialTiles = Array.from(
        document.querySelectorAll(`.key_${keyPressed}`)
      );

      if (state.potentialTiles.length === 0) {
        console.warn("No tiles match the first key press.");
        return;
      }

      highlightTiles(state.potentialTiles);
    } else {
      // Subsequent key presses: filter the potential tiles based on proximity
      state.potentialTiles = filterByProximityAndKey(
        state.potentialTiles,
        keyPressed
      );

      if (state.potentialTiles.length === 1) {
        // If one tile is left, highlight it
        highlightTiles(state.potentialTiles);
      } else if (state.potentialTiles.length > 1) {
        // Refine the search by highlighting tiles that match the key combination
        state.proximityRadius++;
        state.potentialTiles = filterByProximityAndKey(
          state.potentialTiles,
          keyPressed
        );
        highlightTiles(state.potentialTiles);
      } else {
        console.warn("No matching tiles found.");
      }
    }

    // Add the key to the pressed list after processing
    state.keysPressed.push(keyPressed);
  }
}

function highlightTiles(tiles) {
  // Remove existing highlights
  removeHighlight(document.querySelectorAll(".highlight"));
  // Add new highlights
  tiles.forEach((tile) => {
    tile.classList.add("highlight");
  });
}

function filterByProximityAndKey(tiles, keyPressed) {
  return tiles.filter((tile) => {
    // Match the key
    if (tile.textContent.toUpperCase() !== keyPressed) return false;

    // Apply proximity check
    const centerTile = tiles[0]; // Always use the first tile in potentialTiles as the center
    const centerRow = parseInt(centerTile.dataset.row);
    const centerCol = parseInt(centerTile.dataset.col);
    const tileRow = parseInt(tile.dataset.row);
    const tileCol = parseInt(tile.dataset.col);

    return (
      Math.abs(centerRow - tileRow) <= proximityRadius &&
      Math.abs(centerCol - tileCol) <= proximityRadius
    );
  });
}
function removeHighlight(tiles) {
  // logic to remove highlight from tiles
  tiles.forEach((tile) => {
    tile.classList.remove("highlight");
  });
}

function getSelectedTile(keysPressed) {
  // logic to determine the selected tile based on keys pressed
  const keyCombination = keysPressed.join("");
  const row = keyCombination[0]; // assuming first key is row
  const col = keyCombination[1]; // assuming second key is column
  return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function moveMouseToTile(tile) {
  // logic to move the mouse to the tile
  const rect = tile.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  window.scrollTo(x, y);
  // simulate mouse move and click
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
}

function resetState(state) {
  state.isMouseGridOpen = false;
  state.keysPressed = [];
  state.centerTile = null;
  state.proximityRadius = 1; // Reset proximity radius
  removeHighlight(document.querySelectorAll(".highlight"));
  showOrHideMouseGrid();
}
