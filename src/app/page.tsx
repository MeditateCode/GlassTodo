"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trash2, CheckCircle2, Clock, Sparkles } from "lucide-react"; // Premium icons

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
};

export default function GlassTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [dueDate, setDueDate] = useState("");
  const [theme, setTheme] = useState("theme1");
  const [seeAll, setSeeAll] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "none">("none");

  // Themes
  const themes: Record<string, string> = {
    theme1: "from-pink-500 via-purple-500 to-indigo-500",
    theme2: "from-blue-400 via-cyan-400 to-green-400",
    theme3: "from-orange-400 via-red-400 to-pink-500",
    theme4: "from-teal-500 via-emerald-500 to-lime-400",
    theme5: "from-gray-700 via-gray-900 to-black",
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
    if (todos.length > 0 && todos.every((t) => t.completed)) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [todos]);

  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: task,
        completed: false,
        priority,
        dueDate,
      },
    ]);
    setTask("");
    setPriority("low");
    setDueDate("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const priorityColors = {
    low: "bg-blue-200 text-blue-900",
    medium: "bg-yellow-200 text-yellow-900",
    high: "bg-red-200 text-red-900",
  };

  // Filtering + Searching + Sorting
  let displayedTodos = todos.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );
  if (filter === "completed") displayedTodos = displayedTodos.filter((t) => t.completed);
  if (filter === "pending") displayedTodos = displayedTodos.filter((t) => !t.completed);

  if (sortBy === "priority") {
    const order = { high: 1, medium: 2, low: 3 };
    displayedTodos = [...displayedTodos].sort(
      (a, b) => order[a.priority] - order[b.priority]
    );
  } else if (sortBy === "date") {
    displayedTodos = [...displayedTodos].sort(
      (a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${themes[theme]} p-6 transition-all`}
    >
      {/* Theme Selector */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        {Object.keys(themes).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`w-6 h-6 rounded-full bg-gradient-to-r ${themes[t]} ${theme === t ? "ring-2 ring-white scale-110" : ""
              } transition`}
          />
        ))}
      </div>

      {/* Layout Container */}
      <motion.div
        layout
        className="relative flex justify-center items-start gap-8 w-full max-w-6xl"
      >
        {/* Main Card */}
        <motion.div
          layout
          className="w-full max-w-md bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-6 relative z-20"
        >
          <h1 className="flex items-center justify-center gap-2 text-4xl font-extrabold text-black drop-shadow-lg text-center mb-6">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            GlassTodo
          </h1>

          {/* Input */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task..."
                className="flex-1 bg-white/80 text-gray-900 placeholder-gray-500 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
              />
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="bg-white/80 text-gray-900 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="low">Low 🔵</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 bg-white/80 text-gray-900 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={addTodo}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:scale-105 transform transition shadow-md flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> Add
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar mb-4">
            <ul className="space-y-3">
              <AnimatePresence>
                {displayedTodos.map((todo) => (
                  <motion.li
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex justify-between items-center bg-white/40 backdrop-blur-md px-4 py-3 rounded-xl shadow-md text-gray-900"
                  >
                    <div
                      className="flex flex-col flex-1 cursor-pointer"
                      onDoubleClick={() => {
                        const newText = prompt("Edit task:", todo.text);
                        if (newText) editTodo(todo.id, newText);
                      }}
                    >
                      <span
                        onClick={() => toggleTodo(todo.id)}
                        className={`${todo.completed ? "line-through opacity-60" : ""}`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-2 mt-1 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-lg ${priorityColors[todo.priority]}`}
                        >
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="bg-black/20 text-white px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Clock size={12} /> {todo.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="ml-3 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* See All Button */}
          {todos.length > 3 && (
            <button
              onClick={() => setSeeAll(true)}
              className="text-sm text-purple-700 hover:underline w-full text-center"
            >
              See All →
            </button>
          )}
        </motion.div>

        {/* Tasks Panel */}
        <AnimatePresence>
          {seeAll && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="w-full max-w-lg bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 z-10"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">All Tasks</h2>
                <button
                  onClick={() => setSeeAll(false)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Close ✖
                </button>
              </div>

              {/* Search, Filter, Sort */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="bg-white/80 text-gray-900 px-3 py-2 rounded-xl"
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-white/80 text-gray-900 px-3 py-2 rounded-xl"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed ✅</option>
                  <option value="pending">Pending ⏳</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/80 text-gray-900 px-3 py-2 rounded-xl"
                >
                  <option value="none">Sort</option>
                  <option value="priority">By Priority</option>
                  <option value="date">By Date</option>
                </select>
              </div>

              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                <ul className="space-y-3">
                  {displayedTodos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex justify-between items-center bg-white/50 backdrop-blur-md px-4 py-3 rounded-xl shadow-md text-gray-900"
                    >
                      <span>{todo.text}</span>
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-gray-200">
                        {todo.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
