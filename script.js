let currentStartIndex = 26;
let pokemons = [];
let allPokemonList = [];
let shinySources = [];
let currentShinyIndex = 0;
let showOnlyFavorites = false;

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
    document.getElementById(`types${pokemonData.id}`).innerHTML += renderTypesHTML(pokemonData);
    checkFavoriteStatus();
  }
  removeLoadingSpinner();
}

async function loadMorePokemon() {
  showLoadingSpinner();
  noMoreToLoad();
  for (let i = currentStartIndex; i < currentStartIndex + 25 && i <= 1025; i++) {
    if (document.querySelector(`.card[data-id="${i}"]`)) continue;
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let data = await res.json();
    pokemons.push(data);
    allPokemons.innerHTML += renderPokemonCard(data);
    document.getElementById(`types${data.id}`).innerHTML += renderTypesHTML(data);
    checkFavoriteStatus();
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
  let input = search.value.toLowerCase().trim();
  let info = searchInfo, found = false;
  loadMore.style.display = input ? "none" : "flex";
  hideImg.classList.toggle("buttonImg", !input);
  info.textContent = "";
  if (!input) return resetSearch();
  if (isNaN(input) && input.length < 3)
    return info.textContent = "Mindestens 3 Buchstaben eingeben.";
  document.querySelectorAll(".card").forEach(c => {
    let match = c.dataset.name.includes(input) || c.dataset.id.includes(input);
    c.style.display = match ? "block" : "none";
    if (match) found = true;
  });
  if (!found) await loadAndRenderMatch(input, info);
}

function resetSearch() {
  document.querySelectorAll(".card[data-source='loaded']").forEach(c => c.style.display = "block");
  document.querySelectorAll(".card[data-source='search']").forEach(c => c.remove());
}

async function loadAndRenderMatch(input, info) {
  let match = allPokemonList.find(p => p.name === input) || 
    allPokemonList.find(p => p.name.includes(input) || p.url.split("/").filter(Boolean).pop() === input);
  if (!match) {
    info.textContent = "Pokémon nicht gefunden.";
    return;
  }
  let res = await fetch(match.url);
  let data = await res.json();
  pokemons.push(data);
  document.getElementById("allPokemons").innerHTML += renderPokemonCard(data, "search");
  document.getElementById(`types${data.id}`).innerHTML += renderTypesHTML(data);
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
  document.body.style.overflow = "hidden";
  toggleNavButtons(id);
}

function animateStats() {
  document.querySelectorAll('.stat-fill').forEach(bar => {
    bar.style.width = bar.dataset.width;
  });
}


function toggleNavButtons(id) {
  document.querySelector(".nav-button.left").style.display = id <= 1 ? "none" : "block";
  document.querySelector(".nav-button.right").style.display = id >= 1025 ? "none" : "block";
}

function renderPokemonDetail(pokemon) {
  let type = pokemon.types[0].type.name;
  let stats = getStatsHTML(pokemon, type);
  let abilities = getAbilities(pokemon);
  let shiny = getShinyGallery(pokemon);
  let types = renderTypesHTML(pokemon);
  return renderPokemonOverlayDetail(pokemon, type, stats, abilities, shiny, types);
}

function getAbilities(pokemon) {
  return pokemon.abilities.map(a => a.ability.name).join(", ");
}

function getShinyGallery(pokemon) {
  shinySources = [
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
    pokemon.sprites.front_shiny_female,
    pokemon.sprites.back_shiny_female
  ].filter(src => src);
  currentShinyIndex = 0;
  return renderShinyGallery(shinySources, pokemon);
}

function showTab(tabName) {
  document.querySelectorAll(".overlayTabContent").forEach(tab => tab.style.display = "none");
  document.getElementById(`tab-${tabName}`).style.display = "block";
  if (tabName === 'stats') {
    setTimeout(animateStats, 50);
  }
}

function toggleDetailOverlay() {
  document.getElementById("detailPokemon").classList.toggle("hidden");
  document.body.style.overflow = "";
}

function navigateToPokemon(id) {
  if (id < 1 || id > 1025) return;
  let found = pokemons.find(p => p.id === id);
  if (found) {
    showPokemonDetail(id);
  } else {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        pokemons.push(data);
        showPokemonDetail(data.id);
      })
      .catch(e => console.error("Fehler beim Laden", e));
  }
}

function changeShiny(step) {
  if (shinySources.length === 0) return;
  currentShinyIndex = (currentShinyIndex + step + shinySources.length) % shinySources.length;
  document.getElementById("shinyImage").src = shinySources[currentShinyIndex];
}

function prevShiny() { changeShiny(-1); }
function nextShiny() { changeShiny(1); }

function toggleFavorites() {
  search.value = "";
  showOnlyFavorites = !showOnlyFavorites;
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  document.querySelectorAll(".card").forEach(card => {
    let id = +card.dataset.id;
    card.style.display = showOnlyFavorites ? (favs.includes(id) ? "block" : "none") : "block";
  });
  let btn = document.getElementById("search-button");
  btn.textContent = showOnlyFavorites ? "🔁 Show all" : "⭐ Favorites";
  document.getElementById("resetFavoritesContainer").style.display = showOnlyFavorites ? "block" : "none";
}

function toggleFavorite(event, id, starElement) {
  event.stopPropagation();
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    starElement.textContent = "☆";
  } else {
    favs.push(id);
    starElement.textContent = "★";
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
}

function resetFavorites() {
  showOnlyFavorites = false;
  document.querySelectorAll(".card").forEach(card => {
    card.style.display = "block";
  });
  document.getElementById("search-button").textContent = "⭐ Favorites";
  document.getElementById("resetFavoritesContainer").style.display = "none";
}

function resetAllFavorites() {
  localStorage.removeItem("favorites");
  document.querySelectorAll(".fav-star").forEach(star => star.textContent = "☆");
  document.querySelectorAll(".card").forEach(card => card.style.display = "block");
  showOnlyFavorites = false;
  document.getElementById("search-button").textContent = "⭐ Favoriten anzeigen";
  document.getElementById("resetFavoritesContainer").style.display = "none";
}

function checkFavoriteStatus() {
  let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  document.querySelectorAll(".card").forEach(card => {
    let id = +card.dataset.id;
    let star = card.querySelector(".fav-star");
    if (star) star.textContent = favs.includes(id) ? "★" : "☆";
  });
}