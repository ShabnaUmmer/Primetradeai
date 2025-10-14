import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import API from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

class Dashboard extends Component {
  state = { 
    tasks: [], 
    loading: false,
    search: "",
    statusFilter: "all",
    user: null,
    mobileMenuOpen: false
  };

  componentDidMount() {
    this.fetchUserProfile();
    this.fetchTasks();
  }

  fetchUserProfile = async () => {
    try {
      const res = await API.get("/api/auth/profile");
      this.setState({ user: res.data.data.user });
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  fetchTasks = async () => {
    this.setState({ loading: true });
    try {
      const { search, statusFilter } = this.state;
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const queryString = params.toString();
      const url = queryString ? `/api/tasks?${queryString}` : '/api/tasks';

      const res = await API.get(url);
      this.setState({ 
        tasks: res.data.data.tasks || [], 
        loading: false 
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
      this.setState({ loading: false });
    }
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({
      mobileMenuOpen: !prevState.mobileMenuOpen
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  handleStatusFilterChange = (e) => {
    this.setState({ statusFilter: e.target.value }, this.fetchTasks);
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.fetchTasks();
  };

  handleClearFilters = () => {
    this.setState({
      search: "",
      statusFilter: "all"
    }, this.fetchTasks);
  };

  handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/api/tasks/${id}`);
        this.fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task");
      }
    }
  };

  handleUpdate = async (id, updates) => {
    try {
      await API.put(`/api/tasks/${id}`, updates);
      this.fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      throw new Error("Failed to update task");
    }
  };

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  render() {
    const { tasks, loading, search, statusFilter, user, mobileMenuOpen } = this.state;

    return (
      <div className="container-fluid py-4">
        {/* Desktop Navbar - Hidden on mobile */}
        <div className="d-none d-lg-block">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body py-3">
              <div className="row align-items-center justify-content-between">
                {/* Left Side - App Title */}
                <div className="col-auto">
                  <div className="d-flex flex-column">
                    <h1 className="text-primary mb-1 h4">Task Manager</h1>
                    <p className="text-muted mb-0 small">Manage your tasks efficiently</p>
                  </div>
                </div>
                
                {/* Right Side - Profile Details & Actions */}
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-3">
                    {/* Profile Information */}
                    <div className="text-end">
                      <div className="fw-bold text-dark">
                        <i className="fas fa-user me-2"></i>
                        {user?.name}
                      </div>
                      <div className="small text-muted">
                        <i className="fas fa-envelope me-2"></i>
                        {user?.email}
                      </div>
                    </div>
                    
                    {/* Profile Picture & Actions */}
                    <div className="d-flex align-items-center gap-2">
                      {/* Profile Picture */}
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                           style={{width: '45px', height: '45px'}}>
                        <span className="text-white fw-bold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Edit Profile Button */}
                      <Link 
                        to="/profile" 
                        className="btn btn-outline-primary btn-sm"
                        title="Edit Profile"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      
                      {/* Logout Button */}
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={this.handleLogout}
                        title="Logout"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navbar - Hidden on desktop */}
        <div className="d-lg-none">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body py-3">
              {/* Mobile Header Row */}
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-3">
                    {/* Profile Picture */}
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                         style={{width: '40px', height: '40px'}}>
                      <span className="text-white fw-bold small">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* App Title */}
                    <div className="d-flex flex-column">
                      <h1 className="text-primary mb-0 h5">Task Manager</h1>
                      <small className="text-muted">Welcome, {user?.name?.split(' ')[0]}</small>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Menu Button */}
                <div className="col-auto">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={this.toggleMobileMenu}
                  >
                    <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="mt-3 pt-3 border-top">
                  <div className="row g-2">
                    {/* User Info */}
                    <div className="col-12 mb-2">
                      <div className="bg-light rounded p-2 small">
                        <div className="fw-bold">{user?.name}</div>
                        <div className="text-muted">{user?.email}</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="col-6">
                      <Link 
                        to="/profile" 
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => this.setState({ mobileMenuOpen: false })}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Profile
                      </Link>
                    </div>
                    <div className="col-6">
                      <button 
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={this.handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-1"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Task Form */}
          <div className="col-12 col-lg-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <h5 className="card-title mb-0">Add New Task</h5>
              </div>
              <div className="card-body">
                <TaskForm onCreate={this.fetchTasks} />
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto">
                    <h5 className="card-title mb-0">My Tasks ({tasks.length})</h5>
                  </div>
                  <div className="col-auto">
                    <button 
                      className="btn btn-outline-secondary btn-sm"
                      onClick={this.handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-body">
                {/* Search and Filters */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="row g-2 align-items-end">
                      {/* Search Bar */}
                      <div className="col-12 col-md-7">
                        <form onSubmit={this.handleSearchSubmit}>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search tasks by title..."
                              value={search}
                              onChange={this.handleSearchChange}
                            />
                            <button className="btn btn-primary" type="submit">
                              <i className="fas fa-search"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                      
                      {/* Status Filter */}
                      <div className="col-12 col-md-5">
                        <select 
                          className="form-select"
                          value={statusFilter}
                          onChange={this.handleStatusFilterChange}
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <TaskList 
                  tasks={tasks} 
                  onDelete={this.handleDelete}
                  onUpdate={this.handleUpdate}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;