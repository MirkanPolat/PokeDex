let currentStartIndex = 25; // ohne, würde ich immer bei 1 starten

function init() {
  showLoadingSpinner();
  getPokemonData();
}

async function getPokemonData() {
  let pokemonContent = document.getElementById("allPokemons");
  for (let i = 1; i <= 25; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Pokemon 1,2,3...
    let response = await fetch(url);
    let pokemon = await response.json();
    pokemonContent.innerHTML += renderMyPokemon(pokemon);

    for (let j = 0; j < pokemon.types.length; j++) {// für jeden Typen
      let element = pokemon.types[j];
      let allTypes = document.getElementById(`types${pokemon.id}`);
      allTypes.innerHTML += typeTemplate(element);
    }
  }
  removeLoadingSpinner();
}

function renderMyPokemon(pokemon) {
  let mainType = pokemon.types[0].type.name; // holt sich den ersten typen und namen (zb grass)

  return /*html*/ `
      <div class="card ${mainType}"> <!-- übernimmt diie gleichen eigenschaften wie vom 0 type -->
          <div class="card_content">
              <p>Name: ${pokemon.name.toUpperCase()}</p>
              <p># ${pokemon.id}</p>
              <p id="types${pokemon.id}">Type: </p>
              <img src="https://play.pokemonshowdown.com/sprites/ani/${
                pokemon.name
              }.gif">
          </div>
      </div>
    `;
}

function typeTemplate(type) {
  // in dem type.type.name steht zb grass, fire, water
  // doppel type.type weil parameter type ein object ist und type.name der name
  return /*html*/ `
      <span class="type ${type.type.name}">${type.type.name}</span> 
    `;
}

function showLoadingSpinner() {
  document.getElementById("loading").classList.add("active");
}
function removeLoadingSpinner() {
  document.getElementById("loading").classList.remove("active");
}

async function loadMorePokemon() {
  showLoadingSpinner();

  for (let i = currentStartIndex; i < currentStartIndex + 25; i++) {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let data = await res.json();

    document.getElementById("allPokemons").innerHTML += renderMyPokemon(data);

    for (let j = 0; j < data.types.length; j++) {
      let type = data.types[j];
      document.getElementById(`types${data.id}`).innerHTML +=
        typeTemplate(type);
    }
  }

  currentStartIndex += 25;
  removeLoadingSpinner();
}
