import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/Navbar';
import FishList from './components/HalakList';
import FishDetails from './components/HalakDetails';
import FishEdit from './components/HalakEdit';
import AlertMessage from './components/AlertMessage';

function App() {
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 5000);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          {alert.show && <AlertMessage message={alert.message} type={alert.type} />}
          <Routes>
            <Route path="/" element={<Navigate to="/fish" />} />
            <Route path="/fish" element={<FishList showAlert={showAlert} />} />
            <Route path="/fish/:id" element={<FishDetails showAlert={showAlert} />} />
            <Route path="/fish/:id/edit" element={<FishEdit showAlert={showAlert} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;