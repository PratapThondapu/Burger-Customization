import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { burgerListReducer } from "./reducers/burgerReducer";
import { cartReducer } from "./reducers/cartReducer";
import { orderDetailsReducer } from "./reducers/orderReducer";
import { loginReducer,UserReducer} from "./reducers/userReducer";
import { ingredientsReducer } from "./reducers/ingredientsReducer";
const cartItemsFromStore = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
const userinfofromstorage=localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):[];
const shippingaddress=localStorage.getItem('shippingAddress')?JSON.parse(localStorage.getItem('shippingAddress')):{}
const rootReducer = combineReducers({
    burgerList: burgerListReducer,
    cart: cartReducer,
    login: loginReducer,
    orderdetils: orderDetailsReducer,
    user:UserReducer,
    ingredients:ingredientsReducer,
});
const initialState={
    cart:{cartItems:cartItemsFromStore,shippingAddress:shippingaddress},
    login:{userInfo:userinfofromstorage}
}
const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
