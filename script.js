let currentStartIndex = 25; // ohne, würde ich immer bei 1 starten

function init() {
  showLoadingSpinner(); // zeigt den spinner an
  getPokemonData(); // lädt die ersten 25 pokemon
}

async function getPokemonData() {
  let pokemonContent = document.getElementById("allPokemons");
  for (let i = 1; i <= 25; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Pokemon 1,2,3...
    let response = await fetch(url);
    let pokemon = await response.json();
    console.log(pokemon); // gibt die pokemon objekte in der konsole aus
    
    pokemonContent.innerHTML += renderMyPokemon(pokemon);

    for (let j = 0; j < pokemon.types.length; j++) {// für jeden Typen
      let element = pokemon.types[j];
      let allTypes = document.getElementById(`types${pokemon.id}`); // id vom pokemon
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
              <img src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif"
              alt="${pokemon.name}" onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'">
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
  document.getElementById("loading").classList.add("active"); // zeigt den spinner an
}
function removeLoadingSpinner() {
  document.getElementById("loading").classList.remove("active"); // entfernt den spinner
}

async function loadMorePokemon() {
  showLoadingSpinner();

  if(currentStartIndex > 154) { // 154 ist die max anzahl an pokemon
    document.getElementById("loadMore").style.display = "none"; // versteckt den button
    addingButtonImg();
    alert("No more Pokemon to load"); 
    removeLoadingSpinner();
    return;
  }

  for (let i = currentStartIndex; i < currentStartIndex + 25 && i <= 154; i++) { // 25 pokemon
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`); 
    let data = await response.json();

    document.getElementById("allPokemons").innerHTML += renderMyPokemon(data); // pusht die neuen pokemon in den div

    for (let j = 0; j < data.types.length; j++) {
      let type = data.types[j];
      document.getElementById(`types${data.id}`).innerHTML +=
        typeTemplate(type);
    }
  }
  currentStartIndex += 25;
  removeLoadingSpinner();
}

function addingButtonImg(){
  document.getElementById("hideImg").classList.toggle("buttonImg");
}
