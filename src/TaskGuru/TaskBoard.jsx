import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import axios from "axios";
import useAuth from "../Context/useAuth";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import Navbar from "../Pages/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (!user?.email) return;

    const newSocket = io(API_URL, {
      auth: { email: user.email },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.email]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/tasks`, {
          params: { email: user?.email },
        });
        setTasks(data);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) loadTasks();
  }, [user?.email]);

  useEffect(() => {
    if (!socket || !user?.email) return;

    const handleTaskAdded = (newTask) => {
      if (newTask.userEmail === user.email) {
        setTasks((prev) => [...prev, newTask]);
      }
    };

    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask.userEmail === user.email) {
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      }
    };

    const handleTaskDeleted = (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    };

    socket.on("taskAdded", handleTaskAdded);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskAdded", handleTaskAdded);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [socket, user?.email]);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const columns = ["To-Do", "In-Progress", "Done"];

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || !activeTask) return;

    if (over.id !== active.id && typeof over.id === "string") {
      const newCategory = columns.find((col) => col === over.id);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === active.id ? { ...task, category: newCategory } : task
        )
      );

      try {
        await axios.put(`${API_URL}/tasks/${active.id}`, {
          ...activeTask,
          category: newCategory,
        });
      } catch (error) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === active.id
              ? { ...task, category: activeTask.category }
              : task
          )
        );
      }
    }

    setActiveTask(null);
  };

  const handleAddTask = async (newTask) => {
    try {
      await axios.post(`${API_URL}/tasks`, {
        ...newTask,
        userEmail: user.email,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-[90px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Task Board</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {columns.map((column) => (
              <TaskColumn
                key={column}
                title={column}
                tasks={tasks.filter((task) => task.category === column)}
                onDeleteTask={handleDeleteTask}
              />
            ))}

            <DragOverlay>
              {activeTask && (
                <div className="w-[calc(100vw-2rem)] md:w-[350px]">
                  <TaskCard task={activeTask} onDelete={handleDeleteTask} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
        categories={columns}
      />
    </div>
  );
};

export default TaskBoard;
