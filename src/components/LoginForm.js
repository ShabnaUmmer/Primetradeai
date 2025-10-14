import React, { Component } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

class LoginForm extends Component {
  state = { email: "", password: "", error: "", loading: false };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: "" });
    
    try {
      const res = await API.post("/api/auth/login", { // FIXED ENDPOINT
        email: this.state.email,
        password: this.state.password,
      });
      
      // Check for success and proper data structure
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        window.location.href = "/dashboard";
      }
    } catch (error) {
      this.setState({ 
        error: error.response?.data?.message || "Invalid credentials",
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
              <h3 className="text-center mb-3">Login</h3>
              {this.state.error && (
                <div className="alert alert-danger">{this.state.error}</div>
              )}
              <form onSubmit={this.handleSubmit}>
                <input
                  type="email"
                  name="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  className="form-control mb-3"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
                <button 
                  className="btn btn-primary w-100"
                  disabled={this.state.loading}
                >
                  {this.state.loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;