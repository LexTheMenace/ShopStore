import React, { useEffect, useContext, } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Context } from '../context';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const HomeScreen = () => {
  const { state, methods } = useContext(Context);
  const { products, loading, error } = state;
  const { listProducts } = methods;

  useEffect(() => {
    listProducts()
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant='danger' >{error}</Message>
      ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
    </>
  )
};

export default HomeScreen;