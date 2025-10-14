import React, { Component } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

class Profile extends Component {
  state = { 
    user: null, 
    loading: true, 
    error: null,
    editMode: false,
    editedName: "",
    saving: false 
  };

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = async () => {
    try {
      const res = await API.get("/api/auth/profile");
      this.setState({ 
        user: res.data.data.user, 
        editedName: res.data.data.user.name,
        loading: false 
      });
    } catch (err) {
      this.setState({ 
        error: "Failed to load profile", 
        loading: false 
      });
    }
  };

  handleEditToggle = () => {
    this.setState(prevState => ({
      editMode: !prevState.editMode,
      editedName: prevState.user.name
    }));
  };

  handleNameChange = (e) => {
    this.setState({ editedName: e.target.value });
  };

  handleSave = async () => {
  const { editedName, user } = this.state;
  
  if (!editedName.trim()) {
    alert("Name cannot be empty");
    return;
  }

  this.setState({ saving: true });

  try {
    const res = await API.put("/api/auth/profile", {
      name: editedName.trim()
    });

    if (res.data.success) {
      this.setState({
        user: { ...user, name: editedName.trim() },
        editMode: false,
        saving: false
      });
      
      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify({
          ...currentUser,
          name: editedName.trim()
        }));
      }
      
      alert("Profile updated successfully!");
    }
  } catch (error) {
    this.setState({ saving: false });
    const errorMessage = error.response?.data?.message || "Failed to update profile";
    alert(errorMessage);
    console.error("Profile update error:", error);
  }
};

  handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  render() {
    const { user, loading, error, editMode, editedName, saving } = this.state;
    
    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;
    if (!user) return <div className="alert alert-danger mt-5">User not found</div>;

    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">User Profile</h4>
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={this.handleEditToggle}
                  >
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
              
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="User"
                    className="rounded-circle border"
                    width="120"
                    height="120"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">User ID</label>
                    <div className="form-control bg-light">{user.id}</div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold text-muted">Joined Date</label>
                    <div className="form-control bg-light">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedName}
                      onChange={this.handleNameChange}
                      disabled={saving}
                    />
                  ) : (
                    <div className="form-control bg-light">{user.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-muted">Email Address</label>
                  <div className="form-control bg-light">{user.email}</div>
                </div>

                {editMode && (
                  <div className="d-flex gap-2 mb-4">
                    <button 
                      className="btn btn-success"
                      onClick={this.handleSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={this.handleEditToggle}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    onClick={this.handleLogout}
                    className="btn btn-outline-danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;