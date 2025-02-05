import React, { useState } from 'react';

function Register({ onRegisterSuccess }) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        onRegisterSuccess();
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="auth-form">
      <h2>Registro</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={userData.username}
          onChange={(e) => setUserData({...userData, username: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({...userData, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={userData.password}
          onChange={(e) => setUserData({...userData, password: e.target.value})}
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
