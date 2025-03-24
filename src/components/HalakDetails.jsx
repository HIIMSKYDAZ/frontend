import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const HalakDetails = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fish, setFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFishDetails = async () => {
      try {
        const response = await fetch(`https://halak.onrender.com/api/Halak/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('A hal nem található');
          }
          throw new Error('A hálózat nem elérhető');
        }
        const data = await response.json();
        setFish(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        showAlert(`Error: ${error.message}`, 'danger');
        setLoading(false);
      }
    };

    fetchFishDetails();
  }, [id, showAlert]);

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Töltés...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!fish) {
    return <div className="alert alert-warning">A hal nem található</div>;
  }

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h2 className="mb-0">{fish.nev} Details</h2>
          </div>
          
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><strong>ID:</strong> {fish.id}</li>
                  <li className="list-group-item"><strong>Név:</strong> {fish.nev}</li>
                  <li className="list-group-item"><strong>Faj:</strong> {fish.faj}</li>
                  <li className="list-group-item"><strong>Méret:</strong> {fish.meretCm} cm</li>
                  <li className="list-group-item"><strong>Tó ID:</strong> {fish.toId}</li>
                </ul>
              </div>
              
              <div className="col-md-6 text-center">
                {fish.kep ? (
                  <img 
                    src={getBlobImage(fish.kep) || ''} 
                    className="img-fluid detail-image" 
                    alt={fish.nev}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="alert alert-info">A kép nem elérhető</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="card-footer d-flex justify-content-between">
            <Link to="/fish" className="btn btn-secondary">
              <i className="bi bi-arrow-left me-1"></i> Vissza
            </Link>
            <Link to={`/fish/${fish.id}/edit`} className="btn btn-primary">
              <i className="bi bi-pencil-square me-1"></i> Szerkesztés
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalakDetails;