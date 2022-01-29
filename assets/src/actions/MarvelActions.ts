import { Dispatch } from "redux";
import {
  MARVEL_FAIL,
  MARVEL_LOADING,
  MARVEL_SUCCESS,
  MarvelDispatchTypes,
} from "./MarvelActionsTypes";
import axios from "axios";

export const GetMarvelCharacter = (Character: string) => async (dispatch: Dispatch<MarvelDispatchTypes>) => {
  try {
    dispatch({
      type: MARVEL_LOADING
    })
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${Character}`);
    dispatch({
      type: MARVEL_SUCCESS,
      payload: res.data
    })

  } catch (e) {
    dispatch({
      type: MARVEL_FAIL
    })
  }
};