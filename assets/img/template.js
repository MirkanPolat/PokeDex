function renderTypesHTML(pokemon) {
    return pokemon.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ");
}
  
function renderPokemonCard(pokemon, source = "loaded") {
    let mainType = pokemon.types[0].type.name;
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let star = favs.includes(pokemon.id) ? "★" : "☆";
  
    return /*html*/`
      <div class="card ${mainType}" onclick="showPokemonDetail(${pokemon.id})" data-name="${pokemon.name.toLowerCase()}" data-id="${pokemon.id}" data-source="${source}">
      <div class="fav-star" onclick="toggleFavorite(event, ${pokemon.id}, this)">${star}</div>
        <div class="card_content">
          <p>${pokemon.name.toUpperCase()}</p>
          <p>No. ${pokemon.id}</p>
          <p id="types${pokemon.id}">Type: </p>
          <img loading="lazy" src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif"
            onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'">
        </div>
      </div>`;

  }
  
function renderPokemonOverlayDetail(pokemon, type, stats, abilities, shiny, types) {
return /*html*/`
<div class="overlayInner ${type}">
    <div class="overlayHeader ${type}">
        <h2>${pokemon.name.toUpperCase()} <span class="idTag">No. ${pokemon.id}</span></h2>
        <div class="typeRow">${types}</div>
        <div class="pokeImageContainer">
        <button class="nav-button left" onclick="navigateToPokemon(${pokemon.id - 1})">←</button>
        <img loading="lazy" src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif"
                onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'"
                height="140" width="140">
            <button class="nav-button right" onclick="navigateToPokemon(${pokemon.id + 1})">→</button>
        </div>
    </div>
  
    <div class="overlayTabs">
        <button onclick="showTab('about')">About</button>
        <button onclick="showTab('stats')">Base Stats</button>
        <button onclick="showTab('shiny')">Shiny</button>
    </div>
  
    <div class="overlayTabContent" id="tab-about">
        <p><b>Height:</b> ${pokemon.height / 10} m</p>
        <p><b>Weight:</b> ${pokemon.weight / 10} kg</p>
        <p><b>Abilities:</b> ${abilities}</p>
    </div>
  
    <div class="overlayTabContent" id="tab-stats" style="display:none">${stats}</div>
    <div class="overlayTabContent" id="tab-shiny" style="display:none">${shiny}</div>
  
    <button class="closeBtn" onclick="toggleDetailOverlay()">Close</button>
</div>`
}

function getStatsHTML(pokemon, type) {
    return pokemon.stats.map(stat => {
      return /*html*/`
        <div class="stat-row">
            <span class="stat-name">${stat.stat.name}</span>
            <div class="stat-bar">
                <div class="stat-fill ${type}" style="width: ${stat.base_stat / 2}%">${stat.base_stat}</div>
            </div>
        </div>`
    }).join("");
}

function renderShinyGallery(shinySources, pokemon){
    if (shinySources.length === 0) {
        return "<p>Keine Shiny-Bilder vorhanden</p>";
    } else{
    return /*html*/`
    <div class="shiny-gallery">
      <button class="shiny-nav" onclick="prevShiny()">←</button>
      <img id="shinyImage" class="pokeImage" src="${shinySources[0]}" alt="Shiny ${pokemon.name}">
      <button class="shiny-nav" onclick="nextShiny()">→</button>
    </div>`
    }
}