import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// LOAD FROM LOCAL STORAGE
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// SAVE TO LOCAL STORAGE
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);

    localStorage.setItem("cartState", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },

  preloadedState: {
    cart: loadState(),
  },
});

// SAVE EVERY CHANGE
store.subscribe(() => {
  saveState(store.getState().cart);
});