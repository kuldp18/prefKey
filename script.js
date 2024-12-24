const state = {
  grid: document.querySelector(".mouse_grid"),
  pressedKeys: [],
  targetElements: [],
  oldKeys: [],
  isFound: false,
  isGridOpen: false,
  didBreakDown: false,
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

const removeWhiteHighlights = () => {
  const tiles = document.querySelectorAll(".mouse_grid_tile");
  tiles.forEach((tile) => {
    tile.classList.remove("highlight");
  });
};

function findPosition(key1, key2) {
  // the location users wants is always equal to the distance of 26 in the dom tree from the first key to the second key

  if (!state.isGridOpen) return;

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

  state.targetElements = [keyElement1, keyElement2];
  state.oldKeys = [keyElement1.textContent, keyElement2.textContent];

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

  //listen for ctrl + `
  if (e.ctrlKey && e.key === "`") {
    state.isGridOpen = !state.isGridOpen;
    resetGridTiles(state);
    resetState();
    state.isGridOpen
      ? (state.grid.style.visibility = "visible")
      : (state.grid.style.visibility = "hidden");
  }

  if (!state.isFound && state.isGridOpen) {
    if (state.pressedKeys.length === 2) {
      const { keyElement1, keyElement2 } = findPosition(
        state.pressedKeys[0],
        state.pressedKeys[1]
      );
      keyElement1?.classList.add("final-highlight");
      keyElement2?.classList.add("final-highlight");

      state.pressedKeys = [];
      state.isFound = true;
      breakDownGridTiles(state.targetElements);
      removeWhiteHighlights();
    } else {
      // push only A-Z keys
      if (/[A-Z]/.test(keyPressed)) {
        state.pressedKeys.push(keyPressed);
      }
      highlightTiles(state.pressedKeys);
    }
  }
});

function removeGreenHighlights() {
  const tiles = document.querySelectorAll(".mouse_grid_tile");
  tiles.forEach((tile) => {
    tile.classList.remove("final-highlight");
  });
}

function resetState() {
  state.isFound = false;
  state.didBreakDown = false;
  state.oldKeys = [];
  state.pressedKeys = [];
  state.targetElements = [];
  removeGreenHighlights();
  removeWhiteHighlights();
}

function breakDownGridTiles(elements, col = 2, row = 2) {
  if (!elements || !state.isFound) return;
  const [element1, element2] = elements;

  // removeGreenHighlights();

  // clear text content
  element1.textContent = "";
  element2.textContent = "";
  // make them a grid
  element1.style.display = "grid";
  element2.style.display = "grid";

  // create the grid
  element1.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
  element1.style.gridTemplateRows = `repeat(${row}, 1fr)`;
  element2.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
  element2.style.gridTemplateRows = `repeat(${row}, 1fr)`;

  // create the children
  let char = "A";
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const div1 = document.createElement("div");
      div1.textContent = char;
      div1.classList.add("breakdown_tile");
      div1.classList.add(`key_${char}`);
      element1.appendChild(div1);
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
  }

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const div2 = document.createElement("div");
      div2.textContent = char;
      div2.classList.add("breakdown_tile");
      div2.classList.add(`key_${char}`);
      element2.appendChild(div2);
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
  }

  state.didBreakDown = true;
}

function resetGridTiles(state) {
  if (!state.didBreakDown) return;
  const [element1, element2] = state.targetElements;

  // kill all childs of the element
  element1.innerHTML = "";
  element2.innerHTML = "";

  element1.textContent = state.oldKeys[0];
  element2.textContent = state.oldKeys[1];

  element1.classList.add(`mouse_grid_tile`);
  element1.classList.add(`key_${state.oldKeys[0]}`);

  element2.classList.add(`mouse_grid_tile`);
  element2.classList.add(`key_${state.oldKeys[1]}`);

  // delete style attributes
  element1.removeAttribute("style");
  element2.removeAttribute("style");

  state.oldKeys = [];
}
