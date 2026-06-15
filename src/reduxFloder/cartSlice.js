import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;

      const exist = state.cartItems.find(
        (item) => String(item.id) === String(newItem.id)
      );

      if (exist) {
        exist.quantity += 1;
      } else {
        state.cartItems.push({
          ...newItem,
          id: String(newItem.id),
          quantity: 1,
        });
      }
    },

    //  NEW
    buyNow: (state, action) => {
      const item = action.payload;

      state.cartItems = [
        {
          ...item,
          id: String(item.id),
          quantity: 1,
        },
      ];
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => String(item.id) !== String(action.payload)
      );
    },

    increaseQty: (state, action) => {
      const item = state.cartItems.find(
        (item) => String(item.id) === String(action.payload)
      );

      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.cartItems.find(
        (item) => String(item.id) === String(action.payload)
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const {
  addToCart,
  buyNow,
  removeFromCart,
  increaseQty,
  decreaseQty,
} = cartSlice.actions;

export default cartSlice.reducer;