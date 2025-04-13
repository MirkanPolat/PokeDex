let currentStartIndex = 26;
let pokemons = [];
let allPokemonList = [];
let shinySources = [];
let currentShinyIndex = 0;

function init() {
  liveSearch();
  showLoadingSpinner();
  getInitialPokemons();
  loadAllPokemonList();
}

async function getInitialPokemons() {
  let container = document.getElementById("allPokemons");
  for (let i = 1; i <= 25; i++) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokemonData = await response.json();
    pokemons.push(pokemonData);
    container.innerHTML += renderPokemonCard(pokemonData);
    renderPokemonTypes(pokemonData);
  }
  removeLoadingSpinner();
}

function renderPokemonCard(pokemon, source = "loaded") {
  let mainType = pokemon.types[0].type.name;
  return /*html*/`
    <div class="card ${mainType}" onclick="showPokemonDetail(${pokemon.id})" data-name="${pokemon.name.toLowerCase()}" data-id="${pokemon.id}" data-source="${source}">
      <div class="card_content">
        <p>${pokemon.name.toUpperCase()}</p>
        <p>No. ${pokemon.id}</p>
        <p id="types${pokemon.id}">Type: </p>
        <img loading="lazy" src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif" onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'">
      </div>
    </div>
  `
}

function renderPokemonTypes(pokemon) {
  let typeBox = document.getElementById(`types${pokemon.id}`);
  pokemon.types.forEach(type => {
    typeBox.innerHTML += `<span class="type ${type.type.name}">${type.type.name}</span>`;
  });
}

async function loadMorePokemon() {
  showLoadingSpinner();
  if (currentStartIndex > 1025) {
    document.getElementById("loadMore").style.display = "none";
    toggleFinalImage();
    alert("No more Pokémon to load.");
    removeLoadingSpinner();
    return;
  }
  for (let i = currentStartIndex; i < currentStartIndex + 25 && i <= 1025; i++) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokemonData = await response.json();
    pokemons.push(pokemonData);
    document.getElementById("allPokemons").innerHTML += renderPokemonCard(pokemonData);
    renderPokemonTypes(pokemonData);
  }
  currentStartIndex += 25;
  removeLoadingSpinner();
}

function showLoadingSpinner() {
  document.getElementById("loading").classList.add("active");
}

function removeLoadingSpinner() {
  document.getElementById("loading").classList.remove("active");
}

function toggleFinalImage() {
  document.getElementById("hideImg").classList.toggle("buttonImg");
}

function liveSearch() {
  document.getElementById("search").addEventListener("input", searchPokemon);
}

async function searchPokemon() {
  let searchInput = document.getElementById("search").value.toLowerCase().trim();
  let infoBox = document.getElementById("searchInfo");
  infoBox.textContent = "";

  if (!searchInput) {
    document.querySelectorAll(".card[data-source='loaded']").forEach(card => card.style.display = "block");
    document.querySelectorAll(".card[data-source='search']").forEach(card => card.remove());
    return;
  }

  if (searchInput.length < 3) {
    infoBox.textContent = "Bitte mindestens 3 Buchstaben eingeben.";
    return;
  }
  let foundMatch = false;
  document.querySelectorAll(".card").forEach(card => {
    let name = card.dataset.name;
    let id = card.dataset.id;
    let isMatch = name.includes(searchInput) || id.includes(searchInput);
    card.style.display = isMatch ? "block" : "none";
    if (isMatch) foundMatch = true;
  });

  if (!foundMatch) {
    let matchedPokemon = allPokemonList.find(p => p.name.toLowerCase().includes(searchInput));
    if (matchedPokemon) {
      let response = await fetch(matchedPokemon.url);
      let pokemonData = await response.json();
      pokemons.push(pokemonData);
      document.getElementById("allPokemons").innerHTML += renderPokemonCard(pokemonData, "search");
      renderPokemonTypes(pokemonData);
    } else {
      infoBox.textContent = "Pokémon nicht gefunden.";
    }
  }
}


async function loadAllPokemonList() {
  let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  let data = await response.json();
  allPokemonList = data.results;
}

function showPokemonDetail(id) {
  let selectedPokemon = pokemons.find(p => p.id == id);
  if (!selectedPokemon) return;

  let detailContainer = document.getElementById("detailContent");
  detailContainer.innerHTML = renderPokemonDetail(selectedPokemon);
  document.getElementById("detailPokemon").classList.remove("hidden");
}

function renderPokemonDetail(pokemon) {
  let mainType = pokemon.types[0].type.name;
  let height = pokemon.height / 10 + " m";
  let weight = pokemon.weight / 10 + " kg";
  let abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

  let baseStats = pokemon.stats.map(stat => {
    return /*html*/`
     <div class="stat-row">
        <span class="stat-name">${stat.stat.name}</span>
        <div class="stat-bar">
          <div class="stat-fill ${mainType}" style="width: ${stat.base_stat / 2}%">${stat.base_stat}</div>
        </div>
      </div>
    `
  }).join("");

  shinySources = [
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
    pokemon.sprites.front_shiny_female,
    pokemon.sprites.back_shiny_female
  ].filter(src => src);

  currentShinyIndex = 0;

  let shinyGallery = shinySources.length > 0 ? `
    <div class="shiny-gallery">
      <button class="shiny-nav" onclick="prevShiny()">←</button>
      <img id="shinyImage" class="pokeImage" src="${shinySources[0]}" alt="Shiny ${pokemon.name}">
      <button class="shiny-nav" onclick="nextShiny()">→</button>
    </div>
  ` : '<p>Keine Shiny-Bilder vorhanden</p>';

  return `
    <div class="overlayInner ${mainType}">
      <div class="overlayHeader ${mainType}">
        <h2>${pokemon.name.toUpperCase()} <span class="idTag">No. ${pokemon.id}</span></h2>
        <div class="typeRow">
          ${pokemon.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join(" ")}
        </div>
        <div class="pokeImageContainer">
          <button class="nav-button left" onclick="navigateToPokemon(${pokemon.id - 1})">←</button>
          <img loading="lazy" src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif" onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'" height="140" width="140">
          <button class="nav-button right" onclick="navigateToPokemon(${pokemon.id + 1})">→</button>
        </div>
      </div>
      <div class="overlayTabs">
        <button onclick="showTab('about')">About</button>
        <button onclick="showTab('stats')">Base Stats</button>
        <button onclick="showTab('shiny')">Shiny</button>
      </div>
      <div class="overlayTabContent" id="tab-about">
        <p><b>Height:</b> ${height}</p>
        <p><b>Weight:</b> ${weight}</p>
        <p><b>Abilities:</b> ${abilities}</p>
      </div>
      <div class="overlayTabContent" id="tab-stats" style="display:none">
        ${baseStats}
      </div>
      <div class="overlayTabContent" id="tab-shiny" style="display:none">
        ${shinyGallery}
      </div>
      <button class="closeBtn" onclick="toggleDetailOverlay()">Close</button>
    </div>
  `;
}

function showTab(tabName) {
  document.querySelectorAll(".overlayTabContent").forEach(tab => tab.style.display = "none");
  document.getElementById(`tab-${tabName}`).style.display = "block";
}

function toggleDetailOverlay() {
  document.getElementById("detailPokemon").classList.toggle("hidden");
}

function navigateToPokemon(id) {
  if (id < 1 || id > 1025) return;
  let found = pokemons.find(p => p.id === id);
  if (found) {
    showPokemonDetail(id);
  } else {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(response => response.json())
      .then(data => {
        pokemons.push(data);
        showPokemonDetail(data.id);
      })
      .catch(error => console.error("Navigation fehlgeschlagen", error));
  }
}

function prevShiny() {
  if (shinySources.length === 0) return;
  currentShinyIndex = (currentShinyIndex - 1 + shinySources.length) % shinySources.length;
  document.getElementById("shinyImage").src = shinySources[currentShinyIndex];
}

function nextShiny() {
  if (shinySources.length === 0) return;
  currentShinyIndex = (currentShinyIndex + 1) % shinySources.length;
  document.getElementById("shinyImage").src = shinySources[currentShinyIndex];
}
