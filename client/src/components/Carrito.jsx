import React from 'react';

export default function Carrito({ cart, token, setMessage, setCart }) {
  const API_URL = 'http://localhost:3003/api';
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState({
    name: '',
    card: '',
    exp: '',
    cvv: '',
    email: ''
  });
  const [paymentError, setPaymentError] = React.useState('');

  const handlePaymentChange = e => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validatePayment = () => {
    if (!paymentData.name || !paymentData.card || !paymentData.exp || !paymentData.cvv || (!token && !paymentData.email)) {
      setPaymentError('Completa todos los campos.');
      return false;
    }
    if (!/^\d{16}$/.test(paymentData.card)) {
      setPaymentError('Número de tarjeta inválido.');
      return false;
    }
    if (!/^\d{3}$/.test(paymentData.cvv)) {
      setPaymentError('CVV inválido.');
      return false;
    }
    setPaymentError('');
    return true;
  };

  const comprar = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;
    if (!token && !paymentData.email) { setMessage('Debes ingresar tu email.'); return; }
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify({ products: cart.map(p => ({ productId: p._id, quantity: 1 })), payment: paymentData })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Compra realizada con éxito');
        setCart([]);
        setShowPayment(false);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Error al comprar');
    }
  };
  const total = cart.reduce((sum, p) => sum + Number(p.price), 0);
  return (
    <section>
      <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem',marginBottom:'1.5rem'}}>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <div className="card" style={{textAlign:'center',color:'#d32f2f',fontWeight:600}}>Tu carrito está vacío.</div>
      ) : (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'2rem',marginBottom:'2rem'}}>
            {cart.map((p, idx) => (
              <div key={idx} className="card" style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: "1rem", width: "100%", animation:'fadeInLeft 0.7s' }}>
                {p.image && <img src={p.image} alt={p.name} style={{ width: "80px", borderRadius: "12px", marginRight: "1rem" }} />}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#274baf", fontWeight: 700 }}>{p.name}</h3>
                  <p>{p.description}</p>
                  <p style={{ fontWeight: 600, color: "#4a6cf7" }}>${p.price}</p>
                </div>
                <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} style={{marginLeft:'1rem',background:'#d32f2f'}}>Eliminar</button>
              </div>
            ))}
          </div>
          <div className="card" style={{ textAlign: "right", marginTop: "1.5rem", maxWidth:'400px',margin:'2rem auto 0 auto',padding:'2rem',boxShadow:'0 4px 24px rgba(74,108,247,0.10)' }}>
            <strong style={{ fontSize: "1.3rem", color: "#274baf" }}>Total: ${total}</strong>
            <br />
            <button style={{ marginTop: "1.5rem",fontSize:'1.1rem',padding:'0.8rem 2rem' }} onClick={() => setShowPayment(true)}>Finalizar compra</button>
          </div>
          {showPayment && (
            <form className="card" style={{marginTop:'2rem',maxWidth:'400px',margin:'auto',background:'#fff',boxShadow:'0 4px 24px rgba(74,108,247,0.10)'}} onSubmit={comprar}>
              <h3 style={{color:'#274baf',fontWeight:700}}>Datos de Pago</h3>
              <label style={{fontWeight:600}}>Nombre del titular:</label>
              <input name="name" value={paymentData.name} onChange={handlePaymentChange} required />
              <label style={{fontWeight:600}}>Número de tarjeta:</label>
              <input name="card" value={paymentData.card} onChange={handlePaymentChange} required maxLength={16} minLength={16} pattern="\d{16}" />
              <label style={{fontWeight:600}}>Fecha de vencimiento (MM/AA):</label>
              <input name="exp" value={paymentData.exp} onChange={handlePaymentChange} required placeholder="MM/AA" />
              <label style={{fontWeight:600}}>CVV:</label>
              <input name="cvv" value={paymentData.cvv} onChange={handlePaymentChange} required maxLength={3} minLength={3} pattern="\d{3}" />
              {!token && (<>
                <label style={{fontWeight:600}}>Email:</label>
                <input name="email" value={paymentData.email} onChange={handlePaymentChange} required type="email" />
              </>)}
              {paymentError && <div className="message-error">{paymentError}</div>}
              <button type="submit" style={{marginTop:'1rem',fontSize:'1.1rem'}}>Pagar y comprar</button>
              <button type="button" style={{marginTop:'1rem',background:'#d32f2f'}} onClick={()=>setShowPayment(false)}>Cancelar</button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
