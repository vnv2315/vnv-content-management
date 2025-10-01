import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [view, setView] = useState('choice');
  const [authView, setAuthView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', title: '', author: '', category: '', readData: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedView = localStorage.getItem('view');
    if (savedToken && savedView) {
      setToken(savedToken);
      setView(savedView);
      setIsAuthenticated(true);
      fetchContents();
    }
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('view');
    setToken('');
    setIsAuthenticated(false);
    setView('choice');
    setSelectedContent(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('view', 'user');
        setIsAuthenticated(true);
        showMessage('success', 'Signup successful!');
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Signup failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('view', 'user');
        setIsAuthenticated(true);
        showMessage('success', 'Login successful!');
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Login failed');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/user/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('view', 'admin');
        setIsAuthenticated(true);
        showMessage('success', 'Admin login successful!');
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Admin login failed');
    }
  };

  const fetchContents = async () => {
    try {
      const res = await fetch(`${API_URL}/content/lists`);
      const data = await res.json();
      if (data.success) {
        setContents(data.content);
      }
    } catch (err) {
      showMessage('error', 'Failed to fetch contents');
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/content/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify({ title: formData.title, author: formData.author, category: formData.category, readData: formData.readData })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Content added successfully!');
        setFormData({ ...formData, title: '', author: '', category: '', readData: '' });
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Failed to add content');
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/content/update/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify({ title: formData.title, author: formData.author, category: formData.category, readData: formData.readData })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Content updated successfully!');
        setFormData({ ...formData, title: '', author: '', category: '', readData: '' });
        setEditingId(null);
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Failed to update content');
    }
  };

  const handleRemoveContent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/content/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'token': token },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Content removed successfully!');
        fetchContents();
      } else {
        showMessage('error', data.message);
      }
    } catch (err) {
      showMessage('error', 'Failed to remove content');
    }
  };

  const handleEditClick = (content) => {
    setEditingId(content._id);
    setFormData({ ...formData, title: content.title, author: content.author, category: content.category, readData: content.readData });
  };

  const handleContentClick = async (id) => {
    try {
      const res = await fetch(`${API_URL}/content/list/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedContent(data.content);
      }
    } catch (err) {
      showMessage('error', 'Failed to fetch content');
    }
  };

  if (view === 'choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">VNV</h1>
          <div className="space-y-4">
            <button onClick={() => setView('user')} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
              User Portal
            </button>
            <button onClick={() => setView('admin')} className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'user' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">VNV</h1>
          <div className="flex mb-6 border-b">
            <button onClick={() => setAuthView('login')} className={`flex-1 py-2 ${authView === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>
              Login
            </button>
            <button onClick={() => setAuthView('signup')} className={`flex-1 py-2 ${authView === 'signup' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}>
              Signup
            </button>
          </div>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div>
            {authView === 'signup' && (
              <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
            )}
            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
            <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
            <button onClick={authView === 'login' ? handleLogin : handleSignup} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              {authView === 'login' ? 'Login' : 'Signup'}
            </button>
          </div>
          <button onClick={() => setView('choice')} className="w-full mt-4 text-gray-500 hover:text-gray-700">← Back</button>
        </div>
      </div>
    );
  }

  if (view === 'admin' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">VNV Admin</h1>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div>
            <input type="email" placeholder="Admin Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
            <input type="password" placeholder="Admin Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
            <button onClick={handleAdminLogin} className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900">Admin Login</button>
          </div>
          <button onClick={() => setView('choice')} className="w-full mt-4 text-gray-500 hover:text-gray-700">← Back</button>
        </div>
      </div>
    );
  }

  if (view === 'user' && isAuthenticated) {
    if (selectedContent) {
      return (
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-indigo-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">VNV</h1>
              <button onClick={handleLogout} className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800">Logout</button>
            </div>
          </nav>
          <div className="container mx-auto p-6">
            <button onClick={() => setSelectedContent(null)} className="mb-4 text-indigo-600 hover:text-indigo-800">← Back to List</button>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4">{selectedContent.title}</h2>
              <p className="text-gray-600 mb-2">By {selectedContent.author}</p>
              <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mb-6">{selectedContent.category}</span>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContent.readData}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">VNV</h1>
            <button onClick={handleLogout} className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800">Logout</button>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Content List</h2>
          {message.text && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <div className="grid gap-4">
            {contents.map((content) => (
              <div key={content._id} onClick={() => handleContentClick(content._id)} className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition">
                <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
                <p className="text-gray-600 mb-2">By {content.author}</p>
                <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{content.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin' && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-gray-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">VNV Admin</h1>
            <button onClick={handleLogout} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-900">Logout</button>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Content' : 'Add Content'}</h2>
              {message.text && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              <div>
                <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
                <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
                <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full mb-4 p-3 border rounded-lg" />
                <textarea placeholder="Content" value={formData.readData} onChange={(e) => setFormData({ ...formData, readData: e.target.value })} className="w-full mb-4 p-3 border rounded-lg h-32" />
                <div className="flex gap-2">
                  <button onClick={editingId ? handleUpdateContent : handleAddContent} className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900">
                    {editingId ? 'Update' : 'Add'} Content
                  </button>
                  {editingId && (
                    <button onClick={() => { setEditingId(null); setFormData({ ...formData, title: '', author: '', category: '', readData: '' }); }} className="px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Content List</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {contents.map((content) => (
                  <div key={content._id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold mb-1">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">By {content.author}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(content)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Edit</button>
                      <button onClick={() => handleRemoveContent(content._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;