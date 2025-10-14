import React, { Component } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

class SignupForm extends Component {
  state = { 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    error: "", 
    successMessage: "",
    loading: false 
  };

  handleChange = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value, 
      error: "",
      successMessage: "" 
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client validation
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: "Passwords do not match" });
      return;
    }
    
    if (this.state.password.length < 6) {
      this.setState({ error: "Password must be at least 6 characters" });
      return;
    }

    this.setState({ 
      error: "", 
      successMessage: "",
      loading: true 
    });
    
    try {
      const res = await API.post("/api/auth/signup", {
        name: this.state.name.trim(),
        email: this.state.email.toLowerCase().trim(),
        password: this.state.password,
      });
      
      if (res.data.success) {
        //Show success message and redirect to login after 2 seconds
        this.setState({ 
          successMessage: res.data.message,
          loading: false,
          name: "",
          email: "", 
          password: "",
          confirmPassword: ""
        });
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      this.setState({ 
        error: errorMessage, 
        loading: false 
      });
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow p-4 rounded-4">
              <h3 className="text-center mb-3">Sign Up</h3>
              
              {this.state.successMessage && (
                <div className="alert alert-success">
                  {this.state.successMessage}
                  <div className="mt-2">
                    <small>Redirecting to login page...</small>
                  </div>
                </div>
              )}
              
              {this.state.error && (
                <div className="alert alert-danger">{this.state.error}</div>
              )}
              
              <form onSubmit={this.handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Full Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password (min. 6 characters)"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={this.state.loading}
                >
                  {this.state.loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupForm;