import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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
        navigate("/login");
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
  };

  return (
    <div>
      <h2>Task Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleAdd}>
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
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.title} - {t.description} <button onClick={() => handleDelete(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
