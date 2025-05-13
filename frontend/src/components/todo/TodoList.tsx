import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import TodoForm from './TodoForm';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/todo-lists/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (todoId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:8000/api/todo-lists/${todoId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTodos(todos.filter(todo => todo.id !== todoId));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/todo-lists/${todo.id}/`,
        { completed: !todo.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setTodos(todos.map(t => t.id === todo.id ? response.data : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleSave = () => {
    fetchTodos();
    setIsFormOpen(false);
    setSelectedTodo(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <button
          onClick={() => {
            setSelectedTodo(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add New Task
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <TodoForm
            todo={selectedTodo || undefined}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedTodo(null);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo.id} className={todo.completed ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-500'}`}>
                    {todo.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-500'}`}>
                    {new Date(todo.due_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-500'}`}>
                    {todo.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList; 