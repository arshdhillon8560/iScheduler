import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');

  // Load todos from localStorage
  useEffect(() => {
    const todoString = localStorage.getItem('todos');
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    const t = todos.find((item) => item.id === id);
    setTodo(t.todo);
    setPriority(t.priority);
    setTodos(todos.filter((item) => item.id !== id));
  };

  const handleDelete = (e, id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    if (todo.trim().length > 3) {
      setTodos([...todos, { id: uuidv4(), todo, priority, isCompleted: false }]);
      setTodo('');
      setPriority('Low');
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-bold';
      case 'Medium':
        return 'text-yellow-600 font-semibold';
      case 'Low':
        return 'text-green-600 font-medium';
      default:
        return '';
    }
  };

  const filteredTodos = todos.filter(
    (item) =>
      (showFinished || !item.isCompleted) &&
      item.todo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">iScheduler - Manage your Schedules at one place</h1>

        {/* Search */}
        <div className="my-4">
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300"
          />
        </div>

        {/* Add Todo */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="Enter task..."
              className="w-full rounded-full px-5 py-2"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-full px-4 py-2 text-sm"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white"
            >
              Save
            </button>
          </div>
        </div>

        {/* Show Finished Checkbox */}
        <input className="my-4" id="show" onChange={toggleFinished} type="checkbox" checked={showFinished} />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>

        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>

        {/* Todos List */}
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {filteredTodos.length === 0 && <div className="m-5">No Todos to display</div>}

          {filteredTodos.map((item) => (
            <div key={item.id} className="todo flex my-3 justify-between items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="flex gap-3 items-center">
                <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                <div className={item.isCompleted ? 'line-through text-gray-500' : 'text-black'}>
                  {item.todo}
                  <div className={`text-xs ${getPriorityColor(item.priority)}`}>{item.priority}</div>
                </div>
              </div>
              <div className="buttons flex h-full">
                <button
                  onClick={(e) => handleEdit(e, item.id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm my-4">
        Made with <span className="text-red-500">❤️</span> by <span className="font-semibold">Arsh</span> | 2025
      </footer>
    </>
  );
}

export default App;
