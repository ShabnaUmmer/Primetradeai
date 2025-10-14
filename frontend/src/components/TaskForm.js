import React, { Component } from "react";
import API from "../services/api";

class TaskForm extends Component {
  state = { 
    title: "", 
    description: "", 
    error: "", 
    loading: false 
  };

  handleChange = (e) => this.setState({ [e.target.name]: e.target.value, error: "" });

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: "" });
    
    if (!this.state.title.trim()) {
      this.setState({ 
        error: "Title is required",
        loading: false 
      });
      return;
    }
    
    try {
      await API.post("/api/tasks", {
        title: this.state.title,
        description: this.state.description
        // Status will default to 'pending' in backend
      });
      
      this.setState({ 
        title: "", 
        description: "", 
        loading: false 
      });
      this.props.onCreate(); // Refresh the task list
    } catch (error) {
      this.setState({ 
        error: error.response?.data?.message || "Failed to create task",
        loading: false 
      });
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="card p-3 mb-4 border-0 bg-light">
        <h6 className="mb-3 text-primary">Add New Task</h6>
        
        {this.state.error && (
          <div className="alert alert-danger small">{this.state.error}</div>
        )}
        
        <div className="mb-3">
          <label className="form-label small text-muted">Title *</label>
          <input
            type="text"
            name="title"
            className="form-control form-control-sm"
            placeholder="Enter task title"
            value={this.state.title}
            onChange={this.handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label small text-muted">Description</label>
          <textarea
            name="description"
            className="form-control form-control-sm"
            placeholder="Enter task description"
            value={this.state.description}
            onChange={this.handleChange}
            rows="3"
          />
        </div>
        
        <button 
          className="btn btn-primary btn-sm w-100"
          disabled={this.state.loading}
        >
          {this.state.loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    );
  }
}

export default TaskForm;