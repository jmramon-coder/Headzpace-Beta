import React from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const Tasks = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [newTask, setNewTask] = React.useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: crypto.randomUUID(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={addTask} className="px-3 pt-10 pb-2 border-b border-indigo-200 dark:border-cyan-500/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task..."
            className="flex-1 bg-transparent border border-indigo-300 dark:border-cyan-500/30 rounded px-2 py-1 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 placeholder:text-indigo-400 dark:placeholder:text-cyan-500/30"
          />
          <button
            type="submit"
            className="text-indigo-500 hover:text-indigo-600 dark:text-cyan-400 dark:hover:text-cyan-300 p-1"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-auto px-1">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-2 p-2 mx-2 rounded hover:bg-indigo-500/5 dark:hover:bg-cyan-500/5 group"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-4 h-4 border rounded-sm ${
                task.completed ? 'bg-indigo-500 dark:bg-cyan-500 border-indigo-500 dark:border-cyan-500' : 'border-indigo-300 dark:border-cyan-500/30'
              }`}
            />
            <span className={`flex-1 text-sm ${
              task.completed ? 'text-indigo-500/50 dark:text-cyan-500/50 line-through' : 'text-slate-800 dark:text-white'
            }`}>
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-indigo-400/30 hover:text-indigo-500 dark:text-cyan-500/30 dark:hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};