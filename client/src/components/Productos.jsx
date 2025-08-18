import React from 'react';

function Productos({ products = [], setCart }) {
  const [query, setQuery] = React.useState('');
  const [filtered, setFiltered] = React.useState(products);
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  React.useEffect(() => {
    let result = products;
    if (query) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    if (minPrice) {
      result = result.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => Number(p.price) <= Number(maxPrice));
    }
    setFiltered(result);
  }, [query, minPrice, maxPrice, products]);

  return (
    <section>
      <h2 style={{color:'#274baf',fontWeight:700,fontSize:'2rem',marginBottom:'1.5rem'}}>Catálogo de Uniformes</h2>
      <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid #dbe4f3', flex:'2' }}
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid #dbe4f3', width:'140px' }}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid #dbe4f3', width:'140px' }}
        />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'2rem'}}>
        {filtered.length === 0 ? (
          <div style={{gridColumn:'1/-1',textAlign:'center',color:'#d32f2f',fontWeight:600}}>No se encontraron productos.</div>
        ) : (
          filtered.map(p => (
            <div key={p._id} className="card" style={{animation:'fadeInLeft 0.7s',minHeight:'340px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              {p.image && <img src={p.image} alt={p.name} style={{ maxWidth: '120px',margin:'0 auto 1rem auto',borderRadius:'12px',boxShadow:'0 2px 8px rgba(74,108,247,0.12)' }} />}
              <h3 style={{ color: '#274baf', fontWeight: 700, fontSize:'1.3rem',marginBottom:'0.5rem' }}>{p.name}</h3>
              <p style={{marginBottom:'0.5rem'}}>{p.description}</p>
              <p style={{ fontWeight: 600, color: '#4a6cf7', fontSize:'1.1rem',marginBottom:'0.5rem' }}>${p.price}</p>
              <button onClick={() => setCart(prev => [...prev, p])} style={{marginTop:'1rem'}}>Agregar al carrito</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
  export default Productos;
