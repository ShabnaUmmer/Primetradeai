import React, { Component } from "react";

class TaskList extends Component {
  state = {
    editingTask: null,
    editTitle: "",
    editDescription: "",
    editStatus: "",
    saving: false
  };

  handleEditClick = (task) => {
    this.setState({
      editingTask: task.id,
      editTitle: task.title,
      editDescription: task.description || "",
      editStatus: task.status
    });
  };

  handleCancelEdit = () => {
    this.setState({
      editingTask: null,
      editTitle: "",
      editDescription: "",
      editStatus: ""
    });
  };

  handleEditChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSaveEdit = async (taskId) => {
    const { editTitle, editDescription, editStatus } = this.state;
    
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    this.setState({ saving: true });

    try {
      await this.props.onUpdate(taskId, {
        title: editTitle,
        description: editDescription,
        status: editStatus
      });
      
      this.setState({
        editingTask: null,
        editTitle: "",
        editDescription: "",
        editStatus: "",
        saving: false
      });
    } catch (error) {
      this.setState({ saving: false });
      alert("Failed to update task");
    }
  };

  getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning text-dark", text: "Pending" },
      'in-progress': { class: "bg-info text-white", text: "In Progress" },
      completed: { class: "bg-success text-white", text: "Completed" }
    };
    
    const config = statusConfig[status] || { class: "bg-secondary text-white", text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  render() {
    const { tasks, onDelete, loading } = this.props;
    const { editingTask, editTitle, editDescription, editStatus, saving } = this.state;

    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading tasks...</p>
        </div>
      );
    }

    return (
      <div>
        {tasks && tasks.length > 0 ? (
          <div className="row">
            {tasks.map((task) => (
              <div key={task.id} className="col-lg-6 col-md-12 mb-3">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    
                    {/* Task Header with Title and Status */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1 me-3">
                        {editingTask === task.id ? (
                          <input
                            type="text"
                            name="editTitle"
                            className="form-control form-control-lg fw-bold"
                            value={editTitle}
                            onChange={this.handleEditChange}
                            placeholder="Task title"
                          />
                        ) : (
                          <h6 className="card-title text-primary mb-1">{task.title}</h6>
                        )}
                      </div>
                      <div>
                        {editingTask === task.id ? (
                          <select
                            name="editStatus"
                            className="form-select form-select-sm"
                            value={editStatus}
                            onChange={this.handleEditChange}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          this.getStatusBadge(task.status)
                        )}
                      </div>
                    </div>

                    {/* Task Description */}
                    <div className="mb-3">
                      {editingTask === task.id ? (
                        <textarea
                          name="editDescription"
                          className="form-control"
                          value={editDescription}
                          onChange={this.handleEditChange}
                          placeholder="Task description"
                          rows="3"
                        />
                      ) : (
                        <p className="card-text text-muted small mb-0">
                          {task.description || "No description provided"}
                        </p>
                      )}
                    </div>

                    {/* Task Information */}
                    <div className="mb-3">
                      <small className="text-muted">
                        Created: {this.formatDate(task.created_at)}
                      </small>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      {editingTask === task.id ? (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => this.handleSaveEdit(task.id)}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-1"></i>
                                Save
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={this.handleCancelEdit}
                            disabled={saving}
                          >
                            <i className="fas fa-times me-1"></i>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => this.handleEditClick(task)}
                            title="Edit task"
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(task.id)}
                            title="Delete task"
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="text-muted">
              <h5>No tasks found</h5>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TaskList;