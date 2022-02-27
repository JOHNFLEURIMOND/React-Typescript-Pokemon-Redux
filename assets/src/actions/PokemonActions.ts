import { Dispatch } from "redux";
import {
  POKEMON_FAIL,
  POKEMON_LOADING,
  POKEMON_SUCCESS,
  PokemonDispatchTypes,
} from "./PokemonTypes";
import axios from "axios";

export const GetPokemonCharacter = (Character: string) => async (dispatch: Dispatch<PokemonDispatchTypes>) => {
  try {
    dispatch({
      type: POKEMON_LOADING
    })
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Character}`);
    dispatch({
      type: POKEMON_SUCCESS,
      payload: res.data
    })

  } catch (e) {
    dispatch({
      type: POKEMON_FAIL
    })
  }
};