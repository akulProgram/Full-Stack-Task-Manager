import React, { useEffect, useState } from "react";
import api from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import "../App.css";            


const Dashboard = ({ clearInterval }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();

  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/tasks", { title, description: desc });
    setTitle("");
    setDesc("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };


 const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  navigate("/login");
  window.location.reload();
};


  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <h2>Task Dashboard</h2>
        <form className="add-task-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className="dashboard-main">
        <div className="tasks-header">
          <span>Your Tasks</span>
        </div>
        <div className="task-list-wide">
          {tasks.length === 0 ? (
            <div className="no-tasks-msg">No tasks yet. Add your first task!</div>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="task-row-wide">
                <div>
                  <strong style={{ color: "#ffd700" }}>{t.title}</strong>
                  {t.description ? <span style={{ color: "#eee" }}> — {t.description}</span> : ""}
                </div>
                <button className="task-delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
