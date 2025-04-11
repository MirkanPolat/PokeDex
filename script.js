let currentStartIndex = 26; // Gibt an, ab welchem Pokémon die nächsten 25 geladen werden sollen.
let pokemons= []; // speichert alle pokemons aus der api
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
    pokemonContent.innerHTML += renderMyPokemonTemplate(pokemon);

    for (let j = 0; j < pokemon.types.length; j++) {// für jeden Typen
      let element = pokemon.types[j];
      let allTypes = document.getElementById(`types${pokemon.id}`); // id vom pokemon
      allTypes.innerHTML += typeTemplate(element);
    }
  }
  removeLoadingSpinner();
}

function renderMyPokemonTemplate(pokemon, source = "loaded") { // Wenn kein zweiter Wert mitgegeben wird, ist die Quelle "loaded" (normal geladen, nicht durch Suche)
  let mainType = pokemon.types[0].type.name; // nimmt den ersten Typen zb grass 
  return /*html*/`
    <div onclick="detailPokemonOverlay(${pokemon.id}) " class="card ${mainType}" data-name="${pokemon.name.toLowerCase()}" data-id="${pokemon.id}" data-source="${source}"> <!--speichert den Namen und die ID des Pokémon-->
      <div class="card_content">
        <p>${pokemon.name.toUpperCase()}</p>
        <p>No. ${pokemon.id}</p>
        <p id="types${pokemon.id}">Type: </p>
        <img src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif"
             alt="${pokemon.name}"
             onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'">
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

function addingButtonImg(){
  document.getElementById("hideImg").classList.toggle("buttonImg"); // zeigt das bild an
}

async function loadMorePokemon() {
  showLoadingSpinner();

  if(currentStartIndex > 1025) { // 1025 ist die max anzahl an pokemon
    document.getElementById("loadMore").style.display = "none"; // versteckt den button
    addingButtonImg();
    alert("No more Pokemon to load"); 
    removeLoadingSpinner();
    return;
  } 
  for (let i = currentStartIndex; i < currentStartIndex + 25 && i <= 1025; i++) { // lädt die nächsten 25 pokemon 
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

async function searchPokemon(){
  let search = document.getElementById("search").value.toLowerCase().trim(); // nimmt den wert aus dem input und wandelt ihn in kleinbuchstaben um
  if(!search){ // wenn der input leer ist
    document.querySelectorAll('.card[data-source="search"]').forEach(c => c.remove()); // entfernt die pokemon die durch die suche geladen wurden, data source ist eine art von filter 
    document.querySelectorAll('.card[data-source="loaded"]').forEach(c => c.style.display = "block"); // zeigt die pokemon wieder an die geladen wurden, data source loaded sind die geladenen pokemon
    return;
  }
  // hier wird die suche gemacht
  let found = false; 
  document.querySelectorAll('.card[data-source="loaded"]').forEach(c => { // geht alle pokemon durch die geladen wurden
    let match = c.dataset.name.includes(search) || c.dataset.id.includes(search); // prüft ob der name oder die id des pokemon mit dem input übereinstimmt
    c.style.display = match ? "block" : "none"; // wenn es übereinstimmt, wird das pokemon angezeigt, sonst versteckt
    if(match) found = true; // wenn es übereinstimmt, wird found auf true gesetzt
  }); 
  // wenn nichts passendes gefunden wurde, wird die suche fortgesetzt
  if(!found){ // wenns false ist
    let matches = allPokemonList.filter(p => { // hier werden Pokemon gefiltert p ist jedes pokemon
      let id = p.url.split("/").filter(Boolean).pop(); // split zerlegt es in teile filter boolean entfernt leere teile und pop gibt den letzten wert zurück
      return p.name.toLowerCase().includes(search) || id.includes(search); // prüft ob der name oder die id mit dem input übereinstimmt
    });
    // wenn nichts gefunden wurde 
    if(!matches.length){ alert("Pokémon nicht gefunden"); return; } 
    // wenn was gefunden wurde
    for(let p of matches) // p ist ein gefiltertes pokemon matches ist das array mit den gefilterten pokemon
      if(!document.querySelector(`.card[data-name="${p.name.toLowerCase()}"]`)){ // wenn es noch nicht in der liste ist, dann 
         try {
           let res = await fetch(p.url), poke = await res.json(); // hier wird das pokemon geladen und gefetcht
           pokemons.push(poke); 
           document.getElementById("allPokemons").innerHTML += renderMyPokemonTemplate(poke,"search"); // fügt das pokemon in die liste ein, Search ist die Quelle
           poke.types.forEach(t => document.getElementById(`types${poke.id}`).innerHTML += typeTemplate(t)); // fügt die typen in die liste ein
         } catch(e) { console.error(e); } // gibt den fehler aus
      }
  }
  document.querySelectorAll('.card[data-source="search"]').forEach(c => { // geht die gesuchten pokemon durch
    c.style.display = c.dataset.name.includes(search) || c.dataset.id.includes(search) ? "block" : "none"; // zeigt sie an oder versteckt sie wenn sie nicht übereinstimmen
  });
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
// klick ins leere schließt alles
function toggleDetailPokemon() {
  document.getElementById("detailPokemon").classList.toggle("hidden");
}

function detailPokemonOverlay(pokemonId) {
  // 1. Inhalt in #detailContent schreiben
  let detailPokemonElement = document.getElementById("detailContent");
  detailPokemonElement.innerHTML = renderFancyDetailTemplate(pokemonId);

  // 2. Overlay sichtbar machen
  document.getElementById("detailPokemon").classList.remove("hidden");
}

function renderFancyDetailTemplate(pokemonId) {
  let pokemon = pokemons.find(p => p.id == pokemonId); // gibt das pokemon mit der id zurück
  if (!pokemon) { // wenn das pokemon nicht gefunden wurde
    return `<div class="overlayInner">Pokémon mit ID ${pokemonId} nicht gefunden.</div>`; // gibt eine fehlermeldung aus
  }

  // z.B. Hintergrundfarbe basierend auf dem Haupt-Typ
  let mainType = pokemon.types[0].type.name;

  // Beispiel-Werte – in der finalen Version holst du dir Stats, Größe, Gewicht etc. aus dem Pokemon-Objekt
  let name = pokemon.name.toUpperCase();
  let pokeID = pokemon.id;
  let height = (pokemon.height / 10) + " m";      // Die API liefert die Größe in Dezimeter
  let weight = (pokemon.weight / 10) + " kg";     // Die API liefert das Gewicht in Hektogramm
  let abilities = pokemon.abilities.map(a => a.ability.name).join(", ");

  // Optionale Felder – du könntest hier echte Base Stats (pokemon.stats[]) eintragen
  let baseStats = pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join("<br>");

  // Hier das Layout mit Tabs: About | Base Stats | Gender | Shiny
  // Du kannst die Tabs per JS ein-/ausblenden. Hier zeige ich nur ein Beispiel.
  return /*html*/ `
    <div class="overlayInner ${mainType}">
      <div class="overlayHeader ${mainType}">
        <h2>${name} <span class="idTag">No. ${pokeID}</span></h2>
        <div class="typeRow">
          ${pokemon.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ")}
        </div>
        <div class="pokeImageContainer">
        <img src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif" width="200" height="200"
     alt="${pokemon.name}"
     onerror="this.onerror=null; this.src='${pokemon.sprites.other['official-artwork'].front_default}'">
    </div>
      </div>

      <div class="overlayTabs">
        <button onclick="showTab('about')">About</button>
        <button onclick="showTab('stats')">Base Stats</button>
        <button onclick="showTab('gender')">Gender</button>
        <button onclick="showTab('shiny')">Shiny</button>
      </div>

      <!-- Tab: About -->
      <div class="overlayTabContent" id="tab-about">
        <p><b>Species:</b> ${pokemon.name}</p>
        <p><b>Height:</b> ${height}</p>
        <p><b>Weight:</b> ${weight}</p>
        <p><b>Abilities:</b> ${abilities}</p>
      </div>

      <!-- Tab: Base Stats -->
      <div class="overlayTabContent" id="tab-stats" style="display:none;">
        <h3>Base Stats</h3>
        <p>${baseStats}</p>
      </div>

      <!-- Tab: Gender (API v2 hat nicht bei jedem Pokémon gender-Daten, nur example) -->
      <div class="overlayTabContent" id="tab-gender" style="display:none;">
        <p>Gender-Daten hier, falls vorhanden.</p>
      </div>

      <!-- Tab: Shiny -->
      <div class="overlayTabContent" id="tab-shiny" style="display:none;">
        <img class="pokeImage" src="${pokemon.sprites.front_shiny}" alt="Shiny ${name}">
      </div>

      <button class="closeBtn" onclick="toggleDetailPokemon()">Schließen</button>
    </div>
  `;
}

function showTab(tabName) {
  // Alle Tabs ausblenden
  document.querySelectorAll('.overlayTabContent').forEach(tab => tab.style.display = 'none');
  // Gewählten Tab einblenden
  document.getElementById(`tab-${tabName}`).style.display = 'block';
}
