import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, Todo } from '../../store';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  clearError,
} from '../../store/slices/todoSlice';
import TodoForm from './TodoForm';
import '../../styles/responsive.css';

const TodoList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector((state: RootState) => (state.todos as import('../../store/slices/todoSlice').TodoState));

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = async (todo: Omit<Todo, 'id'>) => {
    await dispatch(addTodo(todo));
    setIsFormOpen(false);
  };

  const handleUpdateTodo = async (id: number, todo: Partial<Todo>) => {
    await dispatch(updateTodo({ id, todo }));
    setEditingTodo(null);
  };

  const handleDeleteTodo = async (id: number) => {
    await dispatch(deleteTodo(id));
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    await dispatch(updateTodo({ id, todo: { completed } }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container padding-responsive">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-responsive font-bold mb-4 md:mb-0">Todo List</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Add New Task
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="mb-6">
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setIsFormOpen(false)}
          />
        </div>
      )}

      <div className="table-responsive">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                  <div className="text-sm text-gray-500">{todo.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(todo.due_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      todo.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : todo.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {todo.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleComplete(todo.id!, !todo.completed)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      todo.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {todo.completed ? 'Completed' : 'Pending'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingTodo(todo.id!)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id!)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTodo && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg transform transition-all duration-300 scale-100">
            <TodoForm
              todoId={editingTodo}
              onSubmit={(todo) => handleUpdateTodo(editingTodo, todo)}
              onCancel={() => setEditingTodo(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList; 