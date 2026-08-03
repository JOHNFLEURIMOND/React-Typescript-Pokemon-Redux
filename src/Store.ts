import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "./services/pokemonApi";
import { pokemonTcgApi } from "./services/pokemonTcgApi";

const Store = configureStore({
  reducer: {
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [pokemonTcgApi.reducerPath]: pokemonTcgApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pokemonApi.middleware,
      pokemonTcgApi.middleware,
    ),
});

export type RootStore = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
