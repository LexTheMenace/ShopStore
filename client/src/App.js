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

const App = () => {
  return (
    <>
    <Provider>
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Switch>
        <Route path='/' component={HomeScreen} exact />
        <Route path='/product/:id' component={ProductScreen}  />
        <Route path='/cart/:id?' component={CartScreen} />
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
