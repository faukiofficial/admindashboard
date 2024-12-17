import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import productSlice from "./product/productSlice";
import categorySlice from "./category/categorySlice";
import orderSlice from "./order/orderSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        product: productSlice,
        category: categorySlice,
        order: orderSlice
    },
});

export default store;