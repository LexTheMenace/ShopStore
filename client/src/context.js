import React, { Component } from 'react'
import axios from 'axios';

//Makes info available everywhere in the app
export const Context = React.createContext();

export const ACTIONS = {
    PRODUCT_LIST_REQUEST: 'PRODUCT_LIST_REQUEST',
    PRODUCT_LIST_SUCCESS: 'PRODUCT_LIST_SUCCESS',
    PRODUCT_LIST_FAIL: 'PRODUCT_LIST_FAIL'
}
export const reducer = (state, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            return { loading: true, products: [] };
        case PRODUCT_LIST_SUCCESS:
            return { loading: false, products: action.payload };
        case PRODUCT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    };
};
const {PRODUCT_LIST_FAIL, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS} = ACTIONS

export class Provider extends Component {
    state = {
        products: [],
        loading: false,
        error: '',
        dispatch: action => this.setState(state => reducer(state, action)),

    };
   listProducts = async () => {
        const { dispatch } = this.state
        try {
            dispatch({ type: PRODUCT_LIST_REQUEST });
            const { data } = await axios.get('/api/v1/products');
            console.log(data);
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
                    listProducts: this.listProducts
                }}}>
                {this.props.children}
            </Context.Provider>
        )
    }
};

export const Consumer = Context.Consumer;