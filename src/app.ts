import { HandleUi, addPokemonToPreviewBox, handleInputEntered } from './HandleUi';
import { Pokemon } from './Pokemon';
import { Logic } from './Logic';
var fs = require('fs');

const logic = new Logic();
const handleUi = new HandleUi();

async function retrieveAllPokemonsToDB() {
  let pokemonArr: Pokemon[] = [];
  // If the local storage has no pokemon array, fetch it from the API.
  if (localStorage.getItem('pokemonsData') === null) {
    console.log('Retrieving data from API...');
    // Get list of all pokemons names and urls.
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${logic.totalNUmberOfPokemons()}`
    );
    const pokemonJSON = await res.json();
    // TODO: Make fetching each pokemon async.
    for (let i = 0; i < pokemonJSON.results.length; i++) {
      const pokemonRawData = await fetchPokemonDataByName(pokemonJSON.results[i].name);
      const newPokemon = new Pokemon(pokemonJSON.results[i].name, pokemonRawData);
      pokemonArr.push(newPokemon);
    }
    localStorage.setItem('pokemonsData', JSON.stringify(pokemonArr));
    console.log('Finished retrieving all the data from the API.');
    // Otherwise, get the pokemon array from the local storage.
  } else {
    pokemonArr = JSON.parse(localStorage.getItem('pokemonsData') as string);
    console.log('Retrieved data from local storage.');
  }
  handleUi.finishLoadingUI();
  handleUi.createAndDisplayPokemons(pokemonArr);
  getPokemonFromNameFromServer(logic.getRandomPokemon().name);
  addPokemonToPreviewBox(logic.getRandomPokemon());
}

function addEventListenersForSearch() {
  const submitIcon = document.querySelector('.search-icon') as HTMLElement;
  submitIcon.addEventListener('click', handleInputEntered);

  const inputEl = document.querySelector('.search-input') as HTMLInputElement;
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleInputEntered();
  });

  const getRandomPokemonBtn = document.querySelector('.get-random') as HTMLButtonElement;
  getRandomPokemonBtn.addEventListener('click', () => {
    addPokemonToPreviewBox(logic.getRandomPokemon().name);
  });
}

async function fetchPokemonDataByName(pokemonName: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  return await res.json();
}

retrieveAllPokemonsToDB();
addEventListenersForSearch();