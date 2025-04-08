function init() {
  getPokemonData();
}

async function getPokemonData() {
  let pokemonContent = document.getElementById("allPokemons");
  for (let i = 1; i <= 20; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let pokemon = await response.json();

    for (let j = 0; j < pokemon.types.length; j++) {
      let element = pokemon.types[j];
      pokemonContent.innerHTML += renderMyPokemon(pokemon, element);
    }
  }
}

function renderMyPokemon(pokemon, element) {
  return /*html*/ `
        <div class="card">
            <div class="card_content">
                <p># ${pokemon.id}</p>
                <p>Name: ${pokemon.name.toUpperCase()}</p>
                <p>Type: ${element.type.name}</p>
                <img src="https://play.pokemonshowdown.com/sprites/ani/${pokemon.name}.gif">
            </div>
        </div>
    `;
}
