import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CART_KEY = 'cart';
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function CatalogoPublico() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCartState] = useState(getCart());
  const [added, setAdded] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProductos)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setCart(cart); }, [cart]);

  function addToCart(prod) {
    setCartState(prev => {
      const exists = prev.find(i => i.productId === prod._id);
      if (exists) return prev.map(i => i.productId === prod._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: prod._id, quantity: 1 }];
    });
    setAdded(prod._id);
    setTimeout(() => setAdded(null), 1200);
  }

  if (loading) return <div className="empty-state">Cargando catálogo...</div>;
  if (!productos.length) return <div className="empty-state">Aún no hay uniformes disponibles.</div>;

  return (
    <section>
      <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2em', color: 'var(--color-primary)', marginBottom: 18 }}>Catálogo de Uniformes</h2>
      <div className="catalogo-grid">
        {productos.map(prod => (
          <div className="catalogo-card" key={prod._id}>
            {prod.imageUrl && <img src={prod.imageUrl} alt={prod.name} />}
            <div className="nombre">{prod.name}</div>
            <div className="desc">{prod.model} | Talla: {prod.size}</div>
            <div className="precio">{prod.price.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            {user && user.role === 'user' && (
              <button className="btn btn-primary" onClick={() => addToCart(prod)} disabled={added===prod._id}>
                {added===prod._id ? 'Agregado!' : 'Agregar al carrito'}
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
