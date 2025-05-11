import { useState, useEffect } from 'react'
import './styles/App.css'
import ItemEntryForm from './components/ItemEntryForm'
import NavBar from './components/NavBar'
import catALogLogo from './assets/images/cat-a-log-s.png'
import { auth } from './firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'

const STORAGE_KEY = 'cat_a_log_items';
const LOGO_URL = 'https://cdn-icons-png.flaticon.com/512/616/616408.png'; // Placeholder cat logo

const SORT_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'category', label: 'Category' },
  { key: 'tags', label: 'Tags' },
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
  const [showToast, setShowToast] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setIsLoggedIn(true);
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setRegisterError('All fields are required.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      await sendEmailVerification(userCredential.user);
      setRegisterSuccess('Registration successful! Please check your email to verify your account.');
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
    } catch (err) {
      setRegisterError(err.message);
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

  // Dashboard stats
  const totalItems = items.length;
  const itemsByType = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
  const mostRecent = items[0];

  if (!isLoggedIn && !showRegister) {
    return (
      <div className="login-modal">
        <div className="login-modal-content">
          <h2>Login to Cat-a-Log</h2>
          <form onSubmit={handleLogin}>
            <div>
              <label>Email:</label>
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
          <button className="register-btn" onClick={() => setShowRegister(true)} style={{marginTop: '1rem'}}>Register</button>
        </div>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="login-modal">
        <div className="login-modal-content">
          <h2>Register User</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>Name:</label>
              <input 
                type="text"
                value={registerName} 
                onChange={(e) => setRegisterName(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Email:</label>
              <input 
                type="email"
                value={registerEmail} 
                onChange={(e) => setRegisterEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label>Password:</label>
              <input 
                type="password"
                value={registerPassword} 
                onChange={(e) => setRegisterPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit">Submit Registration</button>
          </form>
          {registerError && <div style={{color: 'red', marginTop: 8}}>{registerError}</div>}
          {registerSuccess && <div style={{color: 'green', marginTop: 8}}>{registerSuccess}</div>}
          <button className="register-btn" onClick={() => setShowRegister(false)} style={{marginTop: '1rem'}}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <NavBar onDashboardClick={() => setShowDashboard(v => !v)} isDashboard={showDashboard} onHomeClick={() => setShowDashboard(false)} />
      {showToast && (
        <div className="toast-notification">
          Starting to update version on every change
        </div>
      )}
      {showDashboard ? (
        <main className="app-main">
          <h2>Dashboard</h2>
          <div className="dashboard-stats">
            <div>Total items: <b>{totalItems}</b></div>
            <div>Items by type:
              <ul>
                {Object.entries(itemsByType).map(([type, count]) => (
                  <li key={type}>{type}: <b>{count}</b></li>
                ))}
              </ul>
            </div>
            {mostRecent && (
              <div>Most recent item: <b>{mostRecent.name}</b> ({mostRecent.type})<br/>
                <span>Category: <b>{mostRecent.category}</b></span><br/>
                <span>Tags: <b>{mostRecent.tags && mostRecent.tags.length > 0 ? mostRecent.tags.join(', ') : '-'}</b></span>
              </div>
            )}
            <div>All tags used:
              <ul>
                {[...new Set(items.flatMap(item => item.tags || []))].map(tag => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      ) : (
        <>
          <header className="app-header">
            <img src={catALogLogo} alt="Cat-a-Log Logo" style={{ width: 80, height: 80, marginBottom: 10 }} />
            <h1>Cat-a-Log</h1>
            <p>Version V1.1</p>
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
                        <td>{item.category || '-'}</td>
                        <td>{item.tags && item.tags.length > 0 ? item.tags.join(', ') : '-'}</td>
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
        </>
      )}
    </div>
  )
}

export default App
