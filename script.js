let allPokemon = [];

function init() {
  getData();
}

async function getData() {
  for (let i = 1; i <= 20; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`; // holt sich die Daten von der API
    let response = await fetch(url); // macht eine Anfrage an die API
    let pokemon = await response.json(); // wartet auf die Antwort der API
    allPokemon.push(pokemon); // fügt die Daten in das Array ein
  }
  renderCardDiv(allPokemon);
}
function renderCardDiv(allPokemon) {
  let cardContainer = document.getElementById("allPokemons"); // holt sich die div
  cardContainer.innerHTML = "";

  for (let i = 0; i < allPokemon.length; i++) {
    // geht durch das Array
    let element = allPokemon[i]; // holt sich das Element
    cardContainer.innerHTML += CardInnerDiv(element, element.types); // übergibt das types-Array
  }
}

function CardInnerDiv(element, types) {
  // Typen als HTML-Elemente generieren
  let typesHTML = "";
  for (let i = 0; i < types.length; i++) {
    typesHTML += `<div class="type">${types[i].type.name}</div>`;
  }

  return `
      <div class="card">
          <img src="${element.sprites.front_default}" alt="${element.name}">
          <h3>${element.name}</h3>
          <div class="types-container">
              ${typesHTML} 
          </div>
          <p>ID: ${element.id}</p>
          <button onclick="showDetails('${element.name}')">Details</button>
      </div>
    `;
}
/* function renderCardDiv(allPokemon) {
  let cardContainer = document.getElementById("allPokemons"); // holt sich die div
  cardContainer.innerHTML = "";

  for (let i = 0; i < allPokemon.length; i++) { // geht durch das Array
    let element = allPokemon[i]; // holt sich das Element
    let typeText = ""; // erstellt eine leere Variable für den Type

    for (let j = 0; j < element.types.length; j++) { // geht durch die Types
      typeText += element.types[j].type.name; // holt sich den Type
  
      if (j < element.types.length - 1) { // wenn es nicht der letzte Type ist
        typeText += ", "; // fügt ein Komma hinzu
      }
    }
    cardContainer.innerHTML += CardInnerDiv(element, typeText);
  }
}

function CardInnerDiv(element, typeText) {
    return `
      <div class="card">
          <img src="${element.sprites.front_default}" alt="${element.name}">
          <h3>${element.name}</h3>
          <p><b>Type:</b> ${typeText}</p>
          <p>ID: ${element.id}</p>
          <button onclick="showDetails('${element.name}')">Details</button>
      </div>
    `;
}
 */
