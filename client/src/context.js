import React, { Component } from 'react'
import axios from 'axios';

//Makes info available everywhere in the app
export const Context = React.createContext();

export const ACTIONS = {
    PRODUCT_LIST_REQUEST: 'PRODUCT_LIST_REQUEST',
    PRODUCT_LIST_SUCCESS: 'PRODUCT_LIST_SUCCESS',
    PRODUCT_LIST_FAIL: 'PRODUCT_LIST_FAIL',
    PRODUCT_DETAILS_REQUEST: 'PRODUCT_DETAILS_REQUEST',
    PRODUCT_DETAILS_SUCCESS: 'PRODUCT_DETAILS_SUCCESS',
    PRODUCT_DETAILS_FAIL: 'PRODUCT_DETAILS_FAIL',
    CART_ADD_ITEM: 'CART_ADD_ITEM',
    CART_REMOVE_ITEM: 'CART_REMOVE_ITEM'
}
export const reducer = (state, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };
        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };
        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true, ...state }
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        case CART_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find((x) => x.product === item.product)
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload),
            }
        default:
            return state;
    };
};
const { CART_ADD_ITEM, CART_REMOVE_ITEM, PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS } = ACTIONS
  
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []
  const initialState = {
    cart: { cartItems: cartItemsFromStorage },
  }

export class Provider extends Component {
    state = {
        products: [],
        loading: false,
        error: '',
        product: {},
        cartItems: cartItemsFromStorage,
        dispatch: action => this.setState(state => reducer(state, action)),

    };

  

    listProducts = async () => {
        const { dispatch } = this.state
        try {
            dispatch({ type: PRODUCT_LIST_REQUEST });
            const { data } = await axios.get('/api/v1/products');
            dispatch({
                type: PRODUCT_LIST_SUCCESS,
                payload: data,
            })
        } catch (error) {
            dispatch({
                type: PRODUCT_LIST_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            })
        }
    };

    listProductDetails = async (id) => {
        const { dispatch } = this.state

        try {
            dispatch({ type: PRODUCT_DETAILS_REQUEST })

            const { data } = await axios.get(`/api/v1/products/${id}`)

            dispatch({
                type: PRODUCT_DETAILS_SUCCESS,
                payload: data,
            })
        } catch (error) {
            dispatch({
                type: PRODUCT_DETAILS_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            })
        }
    }
    addToCart = async (id, qty) => {
        const { data } = await axios.get(`/api/v1/products/${id}`)
        const { dispatch } = this.state

        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty,
            },
        })

        localStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))
    }
    removeFromCart = (id) => {
        const { dispatch } = this.state

        dispatch({
            type: CART_REMOVE_ITEM,
            payload: id,
        })

        localStorage.setItem('cartItems', JSON.stringify(this.state.cartItems))
    }
    componentDidMount() {
        this.listProducts();
        console.log('mount');
    };

    render() {
        return (
            // passing state as value to access anywhere you bring this in
            <Context.Provider value={{
                state: this.state,
                methods: {
                    listProducts: this.listProducts,
                    listProductDetails: this.listProductDetails,
                    addToCart: this.addToCart,
                    removeFromCart: this.removeFromCart
                }
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
};

export const Consumer = Context.Consumer;