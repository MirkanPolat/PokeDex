let currentStartIndex = 25; // ohne, würde ich immer bei 1 starten
let pokemons= []; // leeres array für alle pokemon
let allPokemonList = []; // leeres array für alle pokemon

function init() {
  liveSearch(); // ruft die live search funktion auf
  showLoadingSpinner(); // zeigt den spinner an
  getPokemonData(); // lädt die ersten 25 pokemon
  loadAllPokemonList(); // lädt alle Namen + URLs 
}

async function getPokemonData() {
  let pokemonContent = document.getElementById("allPokemons");
  for (let i = 1; i <= 25; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Pokemon 1,2,3...
    let response = await fetch(url);
    let pokemon = await response.json();
    pokemons.push(pokemon); // pusht jedes einzelne Pokémon in das Array

    console.log(pokemon); // gibt die pokemon objekte in der konsole aus
    
    pokemonContent.innerHTML += renderMyPokemonTemplate(pokemon);

    for (let j = 0; j < pokemon.types.length; j++) {// für jeden Typen
      let element = pokemon.types[j];
      let allTypes = document.getElementById(`types${pokemon.id}`); // id vom pokemon
      allTypes.innerHTML += typeTemplate(element);
    }
  }
  removeLoadingSpinner();
}

function renderMyPokemonTemplate(pokemon) {
  let mainType = pokemon.types[0].type.name;
  return /*html*/ `
      <div class="card ${mainType}" data-name="${pokemon.name}">
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
    pokemons.push(data); // pusht die pokemon in das array

    document.getElementById("allPokemons").innerHTML += renderMyPokemonTemplate(data); // pusht die neuen pokemon in den div

    for (let j = 0; j < data.types.length; j++) {
      let type = data.types[j];
      document.getElementById(`types${data.id}`).innerHTML +=
        typeTemplate(type);
    }
  }
  currentStartIndex += 25; // erhöht den index um 25
  removeLoadingSpinner();
}

function addingButtonImg(){
  document.getElementById("hideImg").classList.toggle("buttonImg"); // zeigt das bild an
}
async function searchPokemon() {
  const searchText = document.getElementById("search").value.toLowerCase();

  // Alle Karten ausblenden
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = "none";
  });

  // Zuerst: Zeige alle bereits geladenen Karten, die zum Suchbegriff passen
  let visibleFound = false;
  document.querySelectorAll(".card").forEach(card => {
    const nameText = card.getAttribute("data-name").toLowerCase();
    if (nameText.includes(searchText)) {
      card.style.display = "block";
      visibleFound = true;
    }
  });

  // Falls noch keine Karten sichtbar sind und etwas gesucht wurde, suche in allPokemonList
  if (!visibleFound && searchText) {
    const matchingPokemons = allPokemonList.filter(p => p.name.includes(searchText));
    if (matchingPokemons.length === 0) {
      return alert("Pokémon nicht gefunden");
    }
    // Lade für jedes gefundene Pokémon die Daten und füge eine Karte hinzu, falls sie noch nicht geladen ist
    for (let p of matchingPokemons) {
      if (!document.querySelector(`.card[data-name="${p.name}"]`)) {
        const res = await fetch(p.url);
        const pokemon = await res.json();
        pokemons.push(pokemon);
        document.getElementById("allPokemons").innerHTML += renderMyPokemonTemplate(pokemon);
        pokemon.types.forEach(t => {
          document.getElementById(`types${pokemon.id}`).innerHTML += typeTemplate(t);
        });
      }
    }
    // Zeige nur die Karten, die dem Suchbegriff entsprechen
    document.querySelectorAll(".card").forEach(card => {
      const nameText = card.getAttribute("data-name").toLowerCase();
      card.style.display = nameText.includes(searchText) ? "block" : "none";
    });
  }

  // Wenn das Suchfeld leer ist, zeige alle Karten an
  if (!searchText) {
    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "block";
    });
  }
}

function liveSearch(){ 
   // addEventListener schaut ob der input verändert wird // input ist der wert aus dem input
  // und wenn ja, dann wird die searchPokemon funktion aufgerufen
  document.getElementById("search").addEventListener("input", searchPokemon)
}

async function loadAllPokemonList() {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  let data = await response.json();
  allPokemonList = data.results; // speichert name + url
}









