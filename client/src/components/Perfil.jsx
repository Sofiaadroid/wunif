import React, { useState } from 'react';
import { useEffect } from 'react';

export default function Perfil({ token, user, setToken, setUser, setIsAdmin, setMessage }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (user?.role === 'admin' && token) {
      fetch('http://localhost:3003/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsers(Array.isArray(data) ? data : []))
        .catch(() => setUsers([]));
    }
  }, [user, token]);
  const [newUser, setNewUser] = useState({ grado:'', acudiente:'', ccAcudiente:'', nombreEstudiante:'', tipoDocEstudiante:'', ccEstudiante:'' });
  const handleUserChange = e => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          grado: newUser.grado,
          acudiente: newUser.acudiente,
          ccAcudiente: newUser.ccAcudiente,
          nombreEstudiante: newUser.nombreEstudiante,
          tipoDocEstudiante: newUser.tipoDocEstudiante,
          ccEstudiante: newUser.ccEstudiante
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Usuario creado: ' + data.email);
        setNewUser({ grado:'', acudiente:'', ccAcudiente:'', nombreEstudiante:'', tipoDocEstudiante:'', ccEstudiante:'', email:'', password:'' });
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error al crear usuario');
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', address: '' });
  const API_URL = 'http://localhost:3003/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        setIsAdmin(data.user.role === 'admin');
        setMessage('Bienvenido, ' + data.user.name);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error de login');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registro exitoso, ahora puedes iniciar sesión');
        setRegisterData({ email: '', password: '', name: '', address: '' });
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error de registro');
    }
  };

  return (
    <section>
      <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem',marginBottom:'1.5rem'}}>Perfil de Usuario</h2>
      {!token ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2rem'}}>
          <form onSubmit={handleLogin} className="card" style={{ maxWidth: "400px", width:'100%',boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
            <label style={{fontWeight:600}}>Email:</label>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label style={{fontWeight:600}}>Contraseña:</label>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" style={{ marginTop: "1rem" }}>Iniciar sesión</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{maxWidth:'400px',margin:'auto',textAlign:'center',boxShadow:'0 4px 24px rgba(74,108,247,0.10)',padding:'2rem'}}>
          <h3 style={{color:'#274baf',fontWeight:700,marginBottom:'1rem'}}>Datos del usuario</h3>
          <p style={{fontSize:'1.1rem'}}><strong>Nombre:</strong> {user?.name}</p>
          <p style={{fontSize:'1.1rem'}}><strong>Email:</strong> {user?.email}</p>
          <p style={{fontSize:'1.1rem'}}><strong>Dirección:</strong> {user?.address}</p>
          <button onClick={() => { setToken(''); setUser(null); setIsAdmin(false); }} style={{marginTop:'1.5rem',fontSize:'1.1rem'}}>Cerrar sesión</button>
          {user?.role === 'admin' && (
            <>
              <form onSubmit={handleCreateUser} className="card" style={{ marginTop: "2rem", boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
                <h3 style={{color:'#274baf',fontWeight:700}}>Crear Usuario (Admin)</h3>
                <label style={{fontWeight:600}}>Email:</label>
                <input type="email" name="email" value={newUser.email||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Contraseña:</label>
                <input type="password" name="password" value={newUser.password||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Grado:</label>
                <select name="grado" value={newUser.grado||''} onChange={handleUserChange} required>
                  <option value="">Selecciona grado</option>
                  {[...Array(11)].map((_,i)=>([
                    <option key={`g${i+1}-1`} value={`${i+1}-1`}>{`${i+1}-1`}</option>,
                    <option key={`g${i+1}-2`} value={`${i+1}-2`}>{`${i+1}-2`}</option>
                  ]))}
                </select>
                <label style={{fontWeight:600}}>Nombre del acudiente:</label>
                <input name="acudiente" value={newUser.acudiente||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>C.C. acudiente:</label>
                <input name="ccAcudiente" value={newUser.ccAcudiente||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Nombre del estudiante:</label>
                <input name="nombreEstudiante" value={newUser.nombreEstudiante||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Edad del estudiante:</label>
                <input name="edadEstudiante" type="number" min="1" value={newUser.edadEstudiante||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Dirección del estudiante:</label>
                <input name="direccionEstudiante" value={newUser.direccionEstudiante||''} onChange={handleUserChange} required />
                <label style={{fontWeight:600}}>Tipo de documento estudiante:</label>
                <select name="tipoDocEstudiante" value={newUser.tipoDocEstudiante||''} onChange={handleUserChange} required>
                  <option value="">Selecciona tipo</option>
                  <option value="PPT">PPT</option>
                  <option value="TI">T.I</option>
                  <option value="CC">C.C</option>
                </select>
                <label style={{fontWeight:600}}>Número de documento estudiante:</label>
                <input name="ccEstudiante" value={newUser.ccEstudiante||''} onChange={handleUserChange} required />
                <button type="submit" style={{ marginTop: "1rem" }}>Crear</button>
              </form>
              {Array.isArray(users) && users.length > 0 && (
                <div className="card" style={{marginTop:'2rem',overflowX:'auto'}}>
                  <h3 style={{color:'#274baf',fontWeight:700}}>Usuarios registrados</h3>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead>
                      <tr style={{background:'#eaf0ff'}}>
                        <th>Email</th>
                        <th>Grado</th>
                        <th>Acudiente</th>
                        <th>CC Acudiente</th>
                        <th>Nombre Estudiante</th>
                        <th>Edad Estudiante</th>
                        <th>Dirección Estudiante</th>
                        <th>Tipo Doc Estudiante</th>
                        <th>CC Estudiante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u=>(
                        <tr key={u._id}>
                          <td>{u.email}</td>
                          <td>{u.grado}</td>
                          <td>{u.acudiente}</td>
                          <td>{u.ccAcudiente}</td>
                          <td>{u.nombreEstudiante}</td>
                          <td>{u.edadEstudiante}</td>
                          <td>{u.direccionEstudiante}</td>
                          <td>{u.tipoDocEstudiante}</td>
                          <td>{u.ccEstudiante}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
