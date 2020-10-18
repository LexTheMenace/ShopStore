import React, { Component } from 'react'
import axios from 'axios';
import { reducer } from './reducer/reducer';
import { CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
} from './actions/constants';


//Makes info available everywhere in the app
export const Context = React.createContext();

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const initialState = {
    cart: { cartItems: cartItemsFromStorage },
    userLogin: { userInfo: userInfoFromStorage },
}

export class Provider extends Component {
    state = {
        products: [],
        loading: false,
        error: '',
        product: {},
        cartItems: cartItemsFromStorage,
        userInfo: userInfoFromStorage,
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
    };

    login = async (email, password) => {
        const { dispatch } = this.state

        try {
          dispatch({
            type: USER_LOGIN_REQUEST,
          })
      
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      
          const { data } = await axios.post(
            '/api/v1/users/login',
            { email, password },
            config
          )
      
          dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
          })
      
          localStorage.setItem('userInfo', JSON.stringify(data))
        } catch (error) {
          dispatch({
            type: USER_LOGIN_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          })
        }
      };
      logout = () => {
        const { dispatch } = this.state
    
        localStorage.removeItem('userInfo')
        dispatch({ type: USER_LOGOUT })
    };

    register = async (name, email, password) => {
      const { dispatch } = this.state
      
        try {
          dispatch({
            type: USER_REGISTER_REQUEST,
          })
      
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      
          const { data } = await axios.post(
            '/api/users',
            { name, email, password },
            config
          )
      
          dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
          })
      
          dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
          })
      
          localStorage.setItem('userInfo', JSON.stringify(data))
        } catch (error) {
          dispatch({
            type: USER_REGISTER_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          })
        }
      };

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
                    removeFromCart: this.removeFromCart,
                    login: this.login,
                    logout: this.logout,
                    register: this.register
                }
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
};

export const Consumer = Context.Consumer;