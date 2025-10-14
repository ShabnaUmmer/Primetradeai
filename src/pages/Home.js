import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends Component {
  render() {
    return (
      <div className="container text-center mt-5">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <h1 className="fw-bold mb-3 text-primary">Welcome to PrimeTrade</h1>
              <p className="lead text-muted">
                A scalable web app for managing your tasks efficiently. 
                Login or Signup to get started.
              </p>
              <div className="d-flex justify-content-around mt-4">
                <Link to="/login" className="btn btn-primary px-4">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline-primary px-4">
                  Signup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
