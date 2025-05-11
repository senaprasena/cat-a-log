import { useState, useEffect } from 'react'
import './styles/App.css'
import ItemEntryForm from './components/ItemEntryForm'

const STORAGE_KEY = 'cat_a_log_items';
const LOGO_URL = 'https://cdn-icons-png.flaticon.com/512/616/616408.png'; // Placeholder cat logo

const SORT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'price', label: 'Price' },
  { key: 'amount', label: 'Amount' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'picture', label: 'Picture' },
];

function App() {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItemIndex, setDeleteItemIndex] = useState(null);

  // Load items from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems([]);
      }
    }
  }, []);

  // Save items to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems(prev => [item, ...prev]);
  };

  // Sorting logic
  const sortedItems = [...items].sort((a, b) => {
    const aVal = (a[sortBy] || '').toString().toLowerCase();
    const bVal = (b[sortBy] || '').toString().toLowerCase();
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  // Handler for future sort buttons
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter both username and password");
    }
  };

  // Delete handlers
  const handleDelete = (idx) => {
    setDeleteItemIndex(idx);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteItemIndex !== null) {
      const newItems = [...items];
      newItems.splice(deleteItemIndex, 1);
      setItems(newItems);
    }
    setShowDeleteConfirm(false);
    setDeleteItemIndex(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteItemIndex(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-modal">
        <div className="login-modal-content">
          <h2>Login to Cat-a-Log</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input 
                type="text"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Password:</label>
              <input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <img src={LOGO_URL} alt="Cat-a-Log Logo" style={{ width: 80, height: 80, marginBottom: 10 }} />
        <h1>Cat-a-Log</h1>
        <p>Version A6.0</p>
      </header>
      <main className="app-main">
        <p>Welcome to Cat-a-Log - Your Produce Inventory Management System</p>
        <ItemEntryForm onAddItem={addItem} />
        <div className="entered-items-table">
          <h2>Entered Items</h2>
          {sortedItems.length === 0 ? (
            <p>No items entered yet.</p>
          ) : (
            <table className="yellow-table">
              <thead>
                <tr>
                  {SORT_FIELDS.map(field => (
                    <th key={field.key}>
                      {field.label}
                      <button
                        className="sort-btn"
                        onClick={() => handleSort(field.key)}
                        disabled={field.key !== 'name'}
                        style={{ marginLeft: 4, cursor: field.key === 'name' ? 'pointer' : 'not-allowed', background: 'none', border: 'none', fontSize: '1em' }}
                        title={field.key === 'name' ? `Sort by ${field.label}` : 'Sorting coming soon'}
                      >
                        {sortBy === field.key ? (sortAsc ? '▲' : '▼') : '↕'}
                      </button>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.price}</td>
                    <td>{item.amount}</td>
                    <td>{item.supplier}</td>
                    <td>{item.picture ? <img src={item.picture} alt="item" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} /> : ''}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(idx)}
                        className="delete-btn"
                        style={{ 
                          background: '#ff4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          padding: '4px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={confirmDelete}
                style={{ 
                  background: '#ff4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Yes, Delete
              </button>
              <button 
                onClick={cancelDelete}
                style={{ 
                  background: '#666', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
