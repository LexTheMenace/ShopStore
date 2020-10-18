import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { Provider } from './context' 
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';

import RegisterScreen from './screens/RegisterScreen';

const App = () => {
  return (
    <>
    <Provider>
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Switch>
          <Route path='/login' component={LoginScreen}  />
          <Route path='/register' component={RegisterScreen}  />
        <Route path='/product/:id' component={ProductScreen}  />
        <Route path='/cart/:id?' component={CartScreen} />
        <Route path='/' component={HomeScreen} exact />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
    </Provider>
    </>
  );
}

export default App;
