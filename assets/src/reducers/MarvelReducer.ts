import {
  MARVEL_FAIL,
  MARVEL_LOADING,
  MARVEL_SUCCESS,
  MarvelDispatchTypes,
  MarvelType
} from "../actions/MarvelActionsTypes";

export interface DefaultStateI {
  loading: boolean,
  pokemon?: MarvelType
}

export const defaultState: DefaultStateI = {
  loading: false
};

export const MarvelReducer = (state: DefaultStateI = defaultState, action: MarvelDispatchTypes) : DefaultStateI => {
  switch (action.type) {
    case MARVEL_FAIL:
      return {
        loading: false,
      }
    case MARVEL_LOADING:
      return {
        loading: true,
      }
    case MARVEL_SUCCESS:
      return {
        loading: false,
        pokemon: action.payload
      }
    default:
      return state
  }
};


export default MarvelReducer