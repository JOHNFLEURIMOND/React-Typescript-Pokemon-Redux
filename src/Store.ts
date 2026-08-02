import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "./services/pokemonApi";

const Store = configureStore({
	reducer: {
		[pokemonApi.reducerPath]: pokemonApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootStore = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;