"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, MoreVertical, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Placeholder functions for API calls and authentication
const fetchTasks = async () => {
  // Implement API call to fetch tasks
  // For now, return an empty object with the correct structure
  return {
    todo: [],
    inProgress: [],
    done: [],
  };
};

const updateTask = (task) => {
  // Implement API call to update task
};

const deleteTask = (taskId) => {
  // Implement API call to delete task
};

const addTask = (task) => {
  // Implement API call to add task
};

const signOut = () => {
  // Implement sign out logic
};

export default function TaskManagementApp() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
        // Set user data from authentication
        setUser({ name: "John Doe", email: "john@example.com" });
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newTasks = { ...tasks };

    // Remove from source
    const [reorderedItem] = newTasks[source.droppableId].splice(
      source.index,
      1
    );

    // Add to destination
    newTasks[destination.droppableId].splice(
      destination.index,
      0,
      reorderedItem
    );

    setTasks(newTasks);
    updateTask(reorderedItem);
  };

  const addNewTask = (task) => {
    const newTasks = {
      ...tasks,
      todo: [{ id: `task${Date.now()}`, ...task }, ...tasks.todo],
    };
    setTasks(newTasks);
    addTask(task);
  };

  const removeTask = (columnId, taskId) => {
    const newTasks = { ...tasks };
    newTasks[columnId] = newTasks[columnId].filter(
      (task) => task.id !== taskId
    );
    setTasks(newTasks);
    deleteTask(taskId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <div className="flex items-center space-x-4">
            <span>{user?.name}</span>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              aria-label="Toggle dark mode"
            />
            {darkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mb-6">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <AddTaskForm onAddTask={addNewTask} />
          </DialogContent>
        </Dialog>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasks).map(([columnId, columnTasks]) => (
              <div
                key={columnId}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow`}
              >
                <h2 className="text-lg font-semibold mb-4 capitalize">
                  {columnId}
                </h2>
                <Droppable droppableId={columnId}>
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-50 dark:bg-gray-700 p-3 rounded-md shadow-sm ${
                                task.dueDate &&
                                new Date(task.dueDate) < new Date()
                                  ? "border-l-4 border-red-500"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{task.title}</h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {task.description}
                                  </p>
                                  {task.dueDate && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Due:{" "}
                                      {new Date(
                                        task.dueDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        removeTask(columnId, task.id)
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask({ title, description, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={50}
        required
      />
      <Textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={200}
      />
      <Input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}
