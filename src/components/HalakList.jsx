import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HalakList = ({ showAlert }) => {
  const [fish, setFish] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const response = await fetch('https://halak.onrender.com/api/Halak');
        if (!response.ok) {
          throw new Error('A hálózat nem elérhető');
        }
        const data = await response.json();
        setFish(data);
        setLoading(false);
      } catch (error) {
        setError('Nem sikerült lekérni a halakat!');
        showAlert('Nem sikerült lekérni a halakat!', 'danger');
        setLoading(false);
      }
    };

    fetchFish();
  }, [showAlert]);

  const getBlobImage = (blobData) => {
    if (!blobData) return null;
  
    if (typeof blobData === 'string') {
      if (blobData.startsWith('data:')) {
        return blobData;
      } else {
        return `data:image/jpeg;base64,${blobData}`;
      }
    }
  
    try {
      let uint8Array;
      if (blobData.data) {
        uint8Array = new Uint8Array(blobData.data);
      } else if (Array.isArray(blobData)) {
        uint8Array = new Uint8Array(blobData);
      } else {
        uint8Array = new Uint8Array(blobData);
      }
  
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Hiba a blob adat konvertálásakor:', err);
      return null;
    }
  };

  return (
    <div>
      <h1 className="mb-4">Halak</h1>
      
      <div className="row">
        {fish.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100 fish-card">
              {item.kep && (
                <div className="text-center p-2">
                  <img 
                    src={getBlobImage(item.kep) || ''} 
                    className="card-img-top fish-image"
                    alt={item.nev} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{item.nev}</h5>
                <p className="card-text">
                  <strong>Típus:</strong> {item.faj}<br />
                  <strong>Méret:</strong> {item.meretCm} cm
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link to={`/fish/${item.id}`} className="btn btn-info">
                  <i className="bi bi-text-paragraph me-1"></i> Részletek
                </Link>
                <Link to={`/fish/${item.id}/edit`} className="btn btn-primary">
                  <i className="bi bi-pencil-square me-1"></i> Szerkesztés
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {fish.length === 0 && !loading && !error && (
        <div className="alert alert-info">Nincs hal az adatbázisban.</div>
      )}
    </div>
  );
};

export default HalakList;
