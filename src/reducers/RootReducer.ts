import {combineReducers} from "redux";
import PokemonReducer from "./PokemonReducer";

const RootReducer = combineReducers({
  pokemon: PokemonReducer
});

export default RootReducer