const state = {
  grid: document.querySelector(".mouse_grid"),
  pressedKeys: [],
  isFound: false,
  oddValues: {
    1: "A",
    3: "B",
    5: "C",
    7: "D",
    9: "E",
    11: "F",
    13: "G",
    15: "H",
    17: "I",
    19: "J",
    21: "K",
    23: "L",
    25: "M",
    27: "N",
    29: "O",
    31: "P",
    33: "Q",
    35: "R",
    37: "S",
    39: "T",
    41: "U",
    43: "V",
    45: "W",
    47: "X",
    49: "Y",
    51: "Z",
  },
  evenValues: {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    6: "F",
    7: "G",
    8: "H",
    9: "I",
    10: "J",
    11: "K",
    12: "L",
    13: "M",
    14: "N",
    15: "O",
    16: "P",
    17: "Q",
    18: "R",
    19: "S",
    20: "T",
    21: "U",
    22: "V",
    23: "W",
    24: "X",
    25: "Y",
    26: "Z",
  },
};

function createTile(grid, text, type) {
  const div = document.createElement("div");
  div.classList.add("mouse_grid_tile");
  div.classList.add(type);
  div.classList.add(`key_${text}`);
  div.textContent = text;
  grid.appendChild(div);
}

function buildOddColumn(grid, text) {
  for (let i = 1; i <= 26; i++) {
    createTile(grid, text, "odd");
  }
}

function buildEvenColumn(grid) {
  for (let i = 1; i <= 26; i++) {
    createTile(grid, state.evenValues[i], "even");
  }
}

function buildGrid(grid) {
  for (let i = 1; i <= 52; i++) {
    if (i % 2 === 0) {
      buildEvenColumn(grid);
    } else {
      buildOddColumn(grid, state.oddValues[i]);
    }
  }
}

const highlightTiles = (pressedKeys) => {
  const tiles = document.querySelectorAll(".mouse_grid_tile");
  tiles.forEach((tile) => {
    if (pressedKeys.includes(tile.textContent)) {
      tile.classList.add("highlight");
    } else {
      tile.classList.remove("highlight");
    }
  });
};

const removeAllHighlights = () => {
  const tiles = document.querySelectorAll(".mouse_grid_tile");
  tiles.forEach((tile) => {
    tile.classList.remove("highlight");
  });
};

function findPosition(key1, key2) {
  // the location users wants is always equal to the distance of 26 in the dom tree from the first key to the second key

  const keyElements1 = Array.from(
    document.querySelectorAll(`div.odd.key_${key1}`)
  );
  const keyElements2 = Array.from(
    document.querySelectorAll(`div.even.key_${key2}`)
  );

  // find the two elements that have a distance of 26
  let keyElement1 = null;
  let keyElement2 = null;
  for (let i = 0; i < keyElements1.length; i++) {
    for (let j = 0; j < keyElements2.length; j++) {
      if (findDistance(keyElements1[i], keyElements2[j]) === 26) {
        keyElement1 = keyElements1[i];
        keyElement2 = keyElements2[j];
        break;
      }
    }
  }

  return {
    keyElement1,
    keyElement2,
  };
}

function findDistance(element1, element2) {
  let distance = 0;
  let currentElement = element1;
  while (
    currentElement !== element2 &&
    currentElement.nextElementSibling !== null
  ) {
    distance++;
    currentElement = currentElement.nextElementSibling;
  }
  return distance;
}

// Initialize the grid
buildGrid(state.grid);

document.addEventListener("keydown", (e) => {
  let keyPressed = e.key.toUpperCase();

  if (!state.isFound) {
    if (state.pressedKeys.length === 2) {
      const { keyElement1, keyElement2 } = findPosition(
        state.pressedKeys[0],
        state.pressedKeys[1]
      );
      keyElement1.classList.add("final-highlight");
      keyElement2.classList.add("final-highlight");
      state.pressedKeys = [];
      state.isFound = true;
      removeAllHighlights();
    } else {
      state.pressedKeys.push(keyPressed);
      highlightTiles(state.pressedKeys);
    }
  }
});
