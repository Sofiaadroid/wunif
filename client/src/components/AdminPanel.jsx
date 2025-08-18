  import React from 'react';
  export default function AdminPanel({ isAdmin, email, password, setEmail, setPassword, handleLogin, handleCreateUser, products, editProductId, editProduct, startEditProduct, handleEditProductChange, handleUpdateProduct, handleDeleteProduct, newProduct, handleProductChange, handleCreateProduct, newUser, handleUserChange }) {
    const [users, setUsers] = React.useState([]);
    React.useEffect(() => {
      if (isAdmin) {
        fetch('http://localhost:3003/api/users', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
          .then(res => res.json())
          .then(data => Array.isArray(data) && setUsers(data));
      }
    }, [isAdmin]);
  if (!isAdmin) {
    return (
      <section>
        <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem',marginBottom:'1.5rem'}}>Panel de Administración</h2>
        <form onSubmit={handleLogin} className="card" style={{ maxWidth: "400px", margin: "auto",boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
          <label style={{fontWeight:600}}>Email admin:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label style={{fontWeight:600}}>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" style={{ marginTop: "1rem" }}>Entrar</button>
        </form>
      </section>
    );
  }
  return (
    <section>
      <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem',marginBottom:'1.5rem'}}>Panel de Administración</h2>
      <form onSubmit={handleCreateUser} className="card" style={{ marginBottom: "2rem", maxWidth: "400px", margin: "auto",boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
        <h3 style={{color:'#274baf',fontWeight:700}}>Crear Usuario</h3>
        <label style={{fontWeight:600}}>Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label style={{fontWeight:600}}>Contraseña:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label style={{fontWeight:600}}>Grado:</label>
        <select name="grado" value={newUser?.grado||''} onChange={e => handleUserChange(e)} required>
          <option value="">Selecciona grado</option>
          {[...Array(11)].map((_,i)=>([
            <option key={`g${i+1}-1`} value={`${i+1}-1`}>{`${i+1}-1`}</option>,
            <option key={`g${i+1}-2`} value={`${i+1}-2`}>{`${i+1}-2`}</option>
          ]))}
        </select>
        <label style={{fontWeight:600}}>Nombre del acudiente:</label>
        <input name="acudiente" value={newUser?.acudiente||''} onChange={e => handleUserChange(e)} required />
        <label style={{fontWeight:600}}>C.C. acudiente:</label>
        <input name="ccAcudiente" value={newUser?.ccAcudiente||''} onChange={e => handleUserChange(e)} required />
        <label style={{fontWeight:600}}>Nombre del estudiante:</label>
        <input name="nombreEstudiante" value={newUser?.nombreEstudiante||''} onChange={e => handleUserChange(e)} required />
        <label style={{fontWeight:600}}>Tipo de documento estudiante:</label>
        <select name="tipoDocEstudiante" value={newUser?.tipoDocEstudiante||''} onChange={e => handleUserChange(e)} required>
          <option value="">Selecciona tipo</option>
          <option value="PPT">PPT</option>
          <option value="TI">T.I</option>
          <option value="CC">C.C</option>
        </select>
        <label style={{fontWeight:600}}>Número de documento estudiante:</label>
        <input name="ccEstudiante" value={newUser?.ccEstudiante||''} onChange={e => handleUserChange(e)} required />
        <button type="submit" style={{ marginTop: "1rem" }}>Crear</button>
      </form>
      <form onSubmit={handleCreateProduct} className="card" style={{ marginBottom: "2rem", maxWidth: "400px", margin: "auto",boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
        <h3 style={{color:'#274baf',fontWeight:700}}>Crear Producto</h3>
        <label style={{fontWeight:600}}>Nombre:</label>
        <input name="name" value={newProduct.name} onChange={handleProductChange} required />
        <label style={{fontWeight:600}}>Descripción:</label>
        <input name="description" value={newProduct.description} onChange={handleProductChange} />
        <label style={{fontWeight:600}}>Precio:</label>
        <input name="price" value={newProduct.price} onChange={handleProductChange} required />
        <label style={{fontWeight:600}}>Imagen (URL):</label>
        <input name="image" value={newProduct.image} onChange={handleProductChange} />
        <button type="submit" style={{ marginTop: "1rem" }}>Crear</button>
      </form>
      <h3 style={{color:'#274baf',fontWeight:700,marginBottom:'1rem'}}>Usuarios</h3>
      <div style={{overflowX:'auto',marginBottom:'2rem'}}>
        <table style={{width:'100%',borderCollapse:'collapse',background:'#eaf0fb',borderRadius:'12px',boxShadow:'0 2px 8px rgba(74,108,247,0.10)'}}>
          <thead>
            <tr style={{background:'#274baf',color:'#fff'}}>
              <th style={{padding:'0.7rem'}}>Email</th>
              <th>Grado</th>
              <th>Acudiente</th>
              <th>C.C. Acudiente</th>
              <th>Estudiante</th>
              <th>Tipo Doc</th>
              <th>Doc Estudiante</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{borderBottom:'1px solid #dbe4f3'}}>
                <td style={{padding:'0.7rem'}}>{u.email}</td>
                <td>{u.grado}</td>
                <td>{u.acudiente}</td>
                <td>{u.ccAcudiente}</td>
                <td>{u.nombreEstudiante}</td>
                <td>{u.tipoDocEstudiante}</td>
                <td>{u.ccEstudiante}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2rem", marginBottom:'2rem' }}>
        {products.map((product) => (
          <div key={product._id} className="card" style={{animation:'fadeInLeft 0.7s',minHeight:'260px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
            {product.image && <img src={product.image} alt={product.name} style={{ maxWidth: '120px',margin:'0 auto 1rem auto',borderRadius:'12px',boxShadow:'0 2px 8px rgba(74,108,247,0.12)' }} />}
            <h4 style={{ color: "#274baf", fontWeight: 700, fontSize:'1.1rem',marginBottom:'0.5rem' }}>{product.name}</h4>
            <p style={{marginBottom:'0.5rem'}}>{product.description}</p>
            <p style={{ fontWeight: 600, color: "#4a6cf7", fontSize:'1.1rem',marginBottom:'0.5rem' }}>${product.price}</p>
            <div style={{display:'flex',gap:'1rem',marginTop:'1rem'}}>
              <button onClick={() => startEditProduct(product)}>Editar</button>
              <button onClick={() => handleDeleteProduct(product._id)} style={{background:'#d32f2f'}}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {editProductId && (
        <form onSubmit={handleUpdateProduct} className="card" style={{ marginTop: "2rem", maxWidth: "400px", margin: "auto",boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
          <h3 style={{color:'#274baf',fontWeight:700}}>Editar Producto</h3>
          <label style={{fontWeight:600}}>Nombre:</label>
          <input name="name" value={editProduct.name} onChange={handleEditProductChange} required />
          <label style={{fontWeight:600}}>Descripción:</label>
          <input name="description" value={editProduct.description} onChange={handleEditProductChange} />
          <label style={{fontWeight:600}}>Precio:</label>
          <input name="price" value={editProduct.price} onChange={handleEditProductChange} required />
          <label style={{fontWeight:600}}>Imagen (URL):</label>
          <input name="image" value={editProduct.image} onChange={handleEditProductChange} />
          <button type="submit" style={{ marginTop: "1rem" }}>Guardar</button>
        </form>
      )}
    </section>
  );
}
