import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage } from "./localstorage.js";

let inputField = document.getElementById("inputField");
let searchBtn = document.getElementById("searchBtn");
let favoritesMenuBtn = document.getElementById("favoritesMenuBtn");
let randomBtn = document.getElementById("randomBtn");
let pokemonID = document.getElementById("pokemonID");
let pokemonName = document.getElementById("pokemonName");
let pokemonImg = document.getElementById("pokemonImg");
let pokemonDescription = document.getElementById("pokemonDescription");
let pokemonType = document.getElementById("pokemonType");
let pokemonLocation = document.getElementById("pokemonLocation");
let pokemonAbilities = document.getElementById("pokemonAbilities");
let pokemonMoves = document.getElementById("pokemonMoves");
let pokemonEvolutions = document.getElementById("pokemonEvolutions");
let heartBtn = document.getElementById("heartBtn");
let favoritesDiv = document.getElementById("favoritesDiv");

let pokemon = "";
let defaultImg;
let shinyImg;

const pokemonAPI = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    return data;
}

searchBtn.addEventListener("click", async () => {
    pokemon = await pokemonAPI(inputField.value);

    updateHeartButton();

    if (pokemon.id > 649) {
        alert("Only Pokemon from Generations 1-5 are supported at this time. Please search for a Pokemon with an ID between 1 and 649.");
    } else {
        pokemonID.textContent = "#" + pokemon.id;
        let name = pokemon.name[0].toUpperCase() + pokemon.name.substring(1);
        pokemonName.textContent = name.split("-").join(" ");
        defaultImg = pokemon.sprites.other["official-artwork"].front_default;
        shinyImg = pokemon.sprites.other["official-artwork"].front_shiny;
        pokemonImg.src = defaultImg;
        const moveNames = pokemon.moves.map(move => move.move.name).join(", ");
        pokemonMoves.textContent = moveNames.split("-").join(" ");
        const typeNames = pokemon.types.map(type => type.type.name).join(", ");
        pokemonType.textContent = typeNames;
        const abilityNames = pokemon.abilities.map(ability => ability.ability.name).join(", ");
        pokemonAbilities.textContent = abilityNames.split("-").join(" ");

        const loc = await fetch(pokemon.location_area_encounters);
        const location = await loc.json();
        if (location.length == 0) {
            pokemonLocation.textContent = "N/A";
        } else {
            pokemonLocation.textContent = location[0].location_area.name.split("-").join(" ");
        }

        const desc = await fetch(pokemon.species.url);
        const description = await desc.json();
        const english = description.flavor_text_entries.findIndex(name => name.language.name == "en");
        pokemonDescription.textContent = description.flavor_text_entries[english].flavor_text;

        const evol = description.evolution_chain.url;
        console.log(evol);

        const evolve = await fetch(evol);
        const evolution = await evolve.json();
        console.log(evolution.chain);
        console.log(evolution.chain.evolves_to[0].evolves_to[0].species.name);
        const evolutionChain = 
        pokemonEvolutions.textContent = evolution.chain.species.name + " > " + evolution.chain.evolves_to[0].species.name + " > " + evolution.chain.evolves_to[0].evolves_to[0].species.name;
    }
});

randomBtn.addEventListener("click", async () => {
    let randomNum = Math.floor(Math.random() * 649);
    pokemon = await pokemonAPI(randomNum);

    updateHeartButton();

    pokemonID.textContent = "#" + pokemon.id;
    let name = pokemon.name[0].toUpperCase() + pokemon.name.substring(1);
    pokemonName.textContent = name.split("-").join(" ");
    defaultImg = pokemon.sprites.other["official-artwork"].front_default;
    shinyImg = pokemon.sprites.other["official-artwork"].front_shiny;
    pokemonImg.src = defaultImg;
    const moveNames = pokemon.moves.map(move => move.move.name).join(", ");
    pokemonMoves.textContent = moveNames.split("-").join(" ");
    const typeNames = pokemon.types.map(type => type.type.name).join(", ");
    pokemonType.textContent = typeNames;
    const abilityNames = pokemon.abilities.map(ability => ability.ability.name).join(", ");
    pokemonAbilities.textContent = abilityNames.split("-").join(" ");

    const loc = await fetch(pokemon.location_area_encounters);
    const location = await loc.json();
    if (location.length == 0) {
        pokemonLocation.textContent = "N/A";
    } else {
        pokemonLocation.textContent = location[0].location_area.name.split("-").join(" ");
    }

    const desc = await fetch(pokemon.species.url);
    const description = await desc.json();
    const english = description.flavor_text_entries.findIndex(name => name.language.name == "en");
    pokemonDescription.textContent = description.flavor_text_entries[english].flavor_text;
});

heartBtn.addEventListener("click", () => {
    let favorites = getLocalStorage();

    if (!favorites.includes(pokemon.name)) {
        saveToLocalStorage(pokemon.name);
        heartBtn.src = "../assets/heart-fill.png";
    } else {
        removeFromLocalStorage(pokemon.name);
        // p.remove();
        heartBtn.src = "../assets/heart.png";
    }

    updateHeartButton();
});

favoritesMenuBtn.addEventListener("click", () => {
    let favorites = getLocalStorage();

    favoritesDiv.textContent = "";

    favorites.map(pokeName => {
        let p = document.createElement("p");

        p.textContent = pokeName;

        p.className = "text-lg font-medium text-gray-900 dark:text-white mb-4";

        favoritesDiv.append(p);
    });
});

pokemonImg.addEventListener("click", () => {
    if (pokemonImg.src == defaultImg) {
        pokemonImg.src = shinyImg;
    } else {
        pokemonImg.src = defaultImg;
    }
});

const updateHeartButton = () => {
    let favorites = getLocalStorage();
    
    const isFavorite = favorites.includes(pokemon.name);

    heartBtn.src = isFavorite ? "../assets/heart-fill.png" : "../assets/heart.png";
};