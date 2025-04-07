let allPokemon = [];

function init(){
    getData();
}

async function getData(){
    let url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=0#`;
    let response = await fetch(url);
    let data = await response.json();
    renderCards(data);
}

function renderCards(data){
    let cardContainer = document.getElementById("allPokemons");
    cardContainer.innerHTML = "";
    allPokemon = data.results;
    console.log(allPokemon);

    for (let i = 0; i < allPokemon.length; i++) {
        cardContainer.innerHTML += CardInnerDiv(allPokemon[i]);
    }
    

}

function CardInnerDiv(pokemon){
    return `
        <div class="card">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <button onclick="showDetails('${pokemon.url}')">Details</button>
        </div>
    `;
}