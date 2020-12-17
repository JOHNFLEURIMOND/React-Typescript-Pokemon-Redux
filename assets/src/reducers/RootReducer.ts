import {combineReducers} from "redux";
import MarvelReducer from "./MarvelReducer";

const RootReducer = combineReducers({
  pokemon: MarvelReducer
});

export default RootReducer