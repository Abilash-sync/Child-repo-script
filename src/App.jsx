import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'todos';
const CATEGORIES = [
  { id: 'work', label: 'Work', color: '#4f46e5' },
  { id: 'personal', label: 'Personal', color: '#10b981' },
  { id: 'shopping', label: 'Shopping', color: '#f59e0b' },
  { id: 'other', label: 'Other', color: '#6b7280' },
];

function loadTodos() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Migrate older entries that don't have a category
    return raw.map((t) => ({ category: 'other', ...t }));
  } catch {
    return [];
  }
}

export default function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('work');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([...todos, { text: trimmed, done: false, category }]);
    setText('');
  }

  function toggleTodo(i) {
    setTodos(todos.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(i) {
    setTodos(todos.filter((_, idx) => idx !== i));
  }

  function clearCompleted() {
    setTodos(todos.filter((t) => !t.done));
  }

  const visible = useMemo(() => {
    if (filter === 'all') return todos;
    return todos.filter((t) => t.category === filter);
  }, [todos, filter]);

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="app">
      <h1>📝 To-Do List</h1>

      <form onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs doing?"
          autoComplete="off"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        <button
          className={'filter' + (filter === 'all' ? ' active' : '')}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = todos.filter((t) => t.category === c.id).length;
          return (
            <button
              key={c.id}
              className={'filter' + (filter === c.id ? ' active' : '')}
              style={{ '--cat-color': c.color }}
              onClick={() => setFilter(c.id)}
            >
              <span className="dot" /> {c.label} ({count})
            </button>
          );
        })}
        {todos.some((t) => t.done) && (
          <button className="filter clear" onClick={clearCompleted}>
            Clear done
          </button>
        )}
      </div>

      <ul>
        {visible.map((todo) => {
          const realIndex = todos.indexOf(todo);
          const cat = CATEGORIES.find((c) => c.id === todo.category) || CATEGORIES[3];
          return (
            <li key={realIndex} className={todo.done ? 'done' : ''}>
              <span
                className="cat-tag"
                style={{ background: cat.color }}
                title={cat.label}
              />
              <span className="text" onClick={() => toggleTodo(realIndex)}>
                {todo.text}
              </span>
              <button className="delete" onClick={() => deleteTodo(realIndex)}>
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="empty">
          {todos.length === 0
            ? 'No tasks yet. Add one above!'
            : 'No tasks in this category.'}
        </p>
      )}

      <div className="footer">
        {remaining} of {todos.length} remaining
      </div>
    </div>
  );
}