import React, { Component } from 'react'
import axios from 'axios';

//Makes info available everywhere in the app
const Context = React.createContext();

const reducer = (state, action) => {
    switch(action.type){
        default: 
        return state;
    }
}

export class Provider extends Component {
    state = {
        products: [],
        dispatch: action => this.setState(state => reducer(state, action))
    };

    componentDidMount() {
        axios.get('/api/v1/products')
            .then(res => {
                console.log(res.data)
            this.setState({products: res.data})
            }) 
            .catch(err => console.log(err))
    }

    render() {
        return (
            // passing state as value to access anywhere you bring this in
        <Context.Provider value={this.state}>
            {this.props.children}
        </Context.Provider>
        )
    }
}

export const Consumer = Context.Consumer;