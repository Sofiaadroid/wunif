import React, { useState } from 'react';
import wunifLogoSVG from './assets/wunifl.svg';
import Productos from './components/Productos';
import Carrito from './components/Carrito';
import Perfil from './components/Perfil';
import AdminPanel from './components/AdminPanel';
const API_URL = 'http://localhost:3003/api';
const SECTIONS = {
  HOME: 'home',
  PRODUCTS: 'productos',
  CART: 'carrito',
  PROFILE: 'perfil',
  ADMIN: 'admin'
};

function BannerSlider() {
  // Banner visual profesional, puede ser slider en el futuro
  return (
    <div className="banner-anim" style={{
      background: "linear-gradient(90deg, #4a6cf7 60%, #eaf0fb 100%)",
      color: "#fff",
      borderRadius: "20px",
      padding: "2.5rem 4rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 12px rgba(74,108,247,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: "160px",
      overflow: "hidden"
    }}>
      <div style={{flex:1, animation:'fadeInLeft 1s'}}> 
        <h2 style={{margin:0,fontWeight:700,fontSize:'2.4rem'}}>Uniformes ICIT</h2>
        <p style={{marginTop:'0.5rem',fontSize:'1.2rem'}}>Calidad, estilo y comodidad para tu día a día escolar.</p>
      </div>
      <img
        src={wunifLogoSVG}
        alt="Logo WUNIF"
        style={{height:'120px',borderRadius:'16px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',marginLeft:'2rem',animation:'fadeInRight 1s'}}
      />
    </div>
  );
}

function App() {
  const [section, setSection] = useState(SECTIONS.HOME);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editProduct, setEditProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [newUser, setNewUser] = useState({ name: '', grade: '', section: '', address: '', age: '', studentDoc: '', parentDoc: '', docType: '' });
  // ...existing code...
  const startEditProduct = (product) => {
    setEditProductId(product._id);
    setEditProduct({ name: product.name, description: product.description, price: product.price, image: product.image });
  };
  const handleEditProductChange = e => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products/${editProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editProduct, email: 'admin@icit.com' })
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.map(p => p._id === editProductId ? data : p));
        setMessage('Producto actualizado');
        setEditProductId(null);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error al actualizar producto');
    }
  };
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@icit.com' })
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
      else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error al eliminar producto');
    }
  };
  // ...existing code...
  const [message, setMessage] = useState("");
  const [token, setTokenState] = useState(localStorage.getItem('token') || '');
  // Si hay sesión iniciada, mostrar la interfaz normal
  if (!token) {
    return (
      <div className="App" style={{maxWidth:'100vw',minHeight:'100vh',background:'linear-gradient(120deg,#4a6cf7 60%,#eaf0fb 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0'}}>
        <nav style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem 0',background:'rgba(255,255,255,0.12)',borderRadius:'32px',boxShadow:'0 2px 16px rgba(74,108,247,0.10)',marginBottom:'2rem',gap:'2rem'}}>
          <img src={wunifLogoSVG} alt="Logo" style={{height:'72px',marginRight:'2rem',boxShadow:'0 2px 8px rgba(74,108,247,0.12)',borderRadius:'16px'}} />
          <button onClick={() => setSection(SECTIONS.HOME)} style={section===SECTIONS.HOME?{background:'#274baf',color:'#fff',fontWeight:700,fontSize:'1.2rem',boxShadow:'0 2px 8px rgba(74,108,247,0.18)'}:{fontWeight:700,fontSize:'1.2rem'}}>Inicio</button>
          <button onClick={() => setSection(SECTIONS.PRODUCTS)} style={section===SECTIONS.PRODUCTS?{background:'#274baf',color:'#fff',fontWeight:700,fontSize:'1.2rem',boxShadow:'0 2px 8px rgba(74,108,247,0.18)'}:{fontWeight:700,fontSize:'1.2rem'}}>Catálogo</button>
        </nav>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'60vh',width:'100%',padding:'0 2rem'}}>
          <div style={{background:'rgba(255,255,255,0.85)',borderRadius:'32px',boxShadow:'0 8px 32px rgba(74,108,247,0.18)',padding:'4rem 3rem',maxWidth:'600px',textAlign:'center',animation:'fadeInUp 1.2s'}}>
            <h1 style={{color:'#274baf',fontWeight:900,fontSize:'3rem',marginBottom:'1.5rem',letterSpacing:'2px'}}>WUNIF - Uniformes ICIT</h1>
            <h2 style={{color:'#4a6cf7',fontWeight:700,fontSize:'2rem',marginBottom:'1rem'}}>Uniformes universitarios de calidad y estilo</h2>
            <p style={{fontSize:'1.2rem',color:'#274baf',marginBottom:'2rem'}}>Descubre la mejor selección de uniformes para ICIT. Compra fácil, rápido y seguro.</p>
            <img src={wunifLogoSVG} alt="Logo" style={{height:'120px',margin:'2rem auto',borderRadius:'16px',boxShadow:'0 2px 8px rgba(74,108,247,0.12)'}} />
            <div style={{marginTop:'2rem',display:'flex',justifyContent:'center',gap:'2rem'}}>
              <button onClick={() => setSection(SECTIONS.PRODUCTS)} style={{background:'#4a6cf7',color:'#fff',fontWeight:700,fontSize:'1.2rem',padding:'1rem 2.5rem',borderRadius:'16px',boxShadow:'0 2px 8px rgba(74,108,247,0.18)'}}>Ver Catálogo</button>
              <button onClick={() => setSection(SECTIONS.HOME)} style={{background:'#eaf0fb',color:'#274baf',fontWeight:700,fontSize:'1.2rem',padding:'1rem 2.5rem',borderRadius:'16px',boxShadow:'0 2px 8px rgba(74,108,247,0.10)'}}>Inicio</button>
            </div>
          </div>
        </div>
        <footer className="footer-anim" style={{textAlign:'center',marginTop:'2rem',color:'#274baf',fontSize:'1.1rem',padding:'2rem 0',background:'linear-gradient(90deg, #eaf0fb 60%, #f5f7fa 100%)',borderTop:'4px solid #4a6cf7',letterSpacing:'2px',boxShadow:'0 2px 8px rgba(74,108,247,0.10)'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
            <span style={{fontWeight:700,fontSize:'1.2rem'}}>© 2025 WUNIF - Uniformes ICIT</span>
            <span style={{fontSize:'1rem'}}>Cra 75 # 3d-41, Cali, Colombia</span>
            <span style={{fontSize:'1rem'}}>+57 3173683264</span>
            <span style={{fontSize:'1rem'}}>icit64@gmail.com | icit64@yahoo.com</span>
            <div className="social" style={{marginTop:'0.5rem',display:'flex',gap:'1.2rem',fontSize:'1.3rem',color:'#274baf'}}>
              <span>Facebook</span>
              <span>Instagram</span>
              <span>YouTube</span>
              <span>Twitter</span>
              <span>TikTok</span>
              <span>WhatsApp</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  // ...existing code...
  // Si hay sesión iniciada, mostrar la interfaz normal
  return (
    <div className="App" style={{maxWidth:'1200px',margin:'0 auto',padding:'2rem 0'}}>
      <header>
        <nav style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.2rem 2rem',background:'#eaf0fb',borderRadius:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)',marginBottom:'2rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
            <img src={wunifLogoSVG} alt="Logo" style={{height:'56px',marginRight:'1rem'}} />
            <h1 style={{color:'#274baf',fontWeight:800,margin:0,fontSize:'2rem',letterSpacing:'2px'}}>WUNIF - Uniformes ICIT</h1>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={() => setSection(SECTIONS.HOME)} style={section===SECTIONS.HOME?{background:'#274baf',color:'#fff'}:{}}>Inicio</button>
            <button onClick={() => setSection(SECTIONS.PRODUCTS)} style={section===SECTIONS.PRODUCTS?{background:'#274baf',color:'#fff'}:{}}>Catálogo</button>
            <button onClick={() => setSection(SECTIONS.CART)} style={section===SECTIONS.CART?{background:'#274baf',color:'#fff'}:{}}>Carrito</button>
            <button onClick={() => setSection(SECTIONS.PROFILE)} style={section===SECTIONS.PROFILE?{background:'#274baf',color:'#fff'}:{}}>Perfil</button>
            {!token && <button onClick={() => setSection(SECTIONS.PROFILE)} style={section===SECTIONS.PROFILE?{background:'#274baf',color:'#fff'}:{}}>Iniciar sesión</button>}
            {token && <span style={{color:'#274baf',fontWeight:600,marginLeft:'1rem'}}>Sesión iniciada</span>}
          </div>
        </nav>
      </header>
      <BannerSlider />
      <main style={{minHeight:'60vh',padding:'0 2rem'}}>
        {section === SECTIONS.HOME && (
          <section style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'300px'}}>
            <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem'}}>Bienvenido a WUNIF-Uniformes ICIT</h2>
            <p style={{fontSize:'1.1rem'}}>Cra 75 # 3d-41, Cali, Colombia</p>
            <p style={{fontSize:'1.1rem'}}>+57 3173683264</p>
            <p style={{fontSize:'1.1rem'}}>icit64@gmail.com | icit64@yahoo.com</p>
            <div className="social" style={{marginTop:'1rem',display:'flex',gap:'1.2rem',fontSize:'1.3rem',color:'#274baf'}}>
              <span>Facebook</span>
              <span>Instagram</span>
              <span>YouTube</span>
              <span>Twitter</span>
              <span>TikTok</span>
              <span>WhatsApp</span>
            </div>
          </section>
        )}
        {section === SECTIONS.PRODUCTS && (
          <Productos products={products || []} setCart={setCart} />
        )}
        {section === SECTIONS.CART && (
          <Carrito cart={cart || []} token={token || ""} setMessage={setMessage} setCart={setCart} />
        )}
        {section === SECTIONS.PROFILE && (
          <Perfil token={token || ""} user={user || {}} setToken={setTokenState} setUser={setUser} setIsAdmin={setIsAdmin} setMessage={setMessage} />
        )}
        {section === SECTIONS.ADMIN && (
          <AdminPanel
            isAdmin={isAdmin}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleCreateUser={handleCreateUser}
            products={products}
            editProductId={editProductId}
            editProduct={editProduct}
            startEditProduct={startEditProduct}
            handleEditProductChange={handleEditProductChange}
            handleUpdateProduct={handleUpdateProduct}
            handleDeleteProduct={handleDeleteProduct}
            newProduct={newProduct}
            handleProductChange={handleProductChange}
            handleCreateProduct={handleCreateProduct}
            newUser={newUser}
            handleUserChange={handleUserChange}
          />
        )}
        {message && (
          <div className={message.toLowerCase().includes('error') ? 'message-error' : 'message-success'} style={{maxWidth:'500px',margin:'2rem auto',fontSize:'1.1rem',boxShadow:'0 2px 8px rgba(74,108,247,0.10)',textAlign:'center'}}>
            {message.toLowerCase().includes('error') ? '❌ ' : '✅ '}{message}
          </div>
        )}
      </main>
      <footer className="footer-anim" style={{textAlign:'center',marginTop:'2rem',color:'#274baf',fontSize:'1.1rem',padding:'2rem 0',background:'linear-gradient(90deg, #eaf0fb 60%, #f5f7fa 100%)',borderTop:'4px solid #4a6cf7',letterSpacing:'2px',boxShadow:'0 2px 8px rgba(74,108,247,0.10)'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'1rem'}}>
          <span style={{fontWeight:700,fontSize:'1.2rem'}}>© 2025 WUNIF - Uniformes ICIT</span>
          <span style={{fontSize:'1rem'}}>Cra 75 # 3d-41, Cali, Colombia</span>
          <span style={{fontSize:'1rem'}}>+57 3173683264</span>
          <span style={{fontSize:'1rem'}}>icit64@gmail.com | icit64@yahoo.com</span>
          <div className="social" style={{marginTop:'0.5rem',display:'flex',gap:'1.2rem',fontSize:'1.3rem',color:'#274baf'}}>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>YouTube</span>
            <span>Twitter</span>
            <span>TikTok</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
