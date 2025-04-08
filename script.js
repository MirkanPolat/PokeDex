function init() {
  getPokemonData();
}

async function getPokemonData() {
  let pokemonContent = document.getElementById("allPokemons");
  for (let i = 1; i <= 25; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`; // Pokemon 1,2,3...
    let response = await fetch(url);
    let pokemon = await response.json();
    pokemonContent.innerHTML += renderMyPokemon(pokemon);

    for (let j = 0; j < pokemon.types.length; j++) {
        let element = pokemon.types[j];
        let allTypes = document.getElementById(`types-${pokemon.id}`);
        allTypes.innerHTML += typeTemplate(element)
      }
      
  }
}

function renderMyPokemon(pokemon) {
    let mainType = pokemon.types[0].type.name;
  
    return /*html*/ `
      <div class="card ${mainType}">
          <div class="card_content">
              <p>Name: ${pokemon.name.toUpperCase()}</p>
              <p># ${pokemon.id}</p>
              <p id="types-${pokemon.id}">Type: </p>
              <img src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif">
          </div>
      </div>
    `;
  }
  

function typeTemplate(type) {
    return /*html*/ `
      <span class="type ${type.type.name}">${type.type.name}</span>
    `;
  }