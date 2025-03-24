import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const HalakEdit = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [fishData, setFishData] = useState({
    id: '',
    nev: '',
    faj: '',
    meretCm: 0,
    toId: 0,
    kep: null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

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
        setFishData(data);
         
        if (data.kep) {
        if (typeof data.kep === 'string') {
        setImagePreview(`data:image/jpeg;base64,${data.kep}`);
      }
      else {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(data.kep)));
        setImagePreview(`data:image/jpeg;base64,${base64String}`);
      }
    }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        showAlert(`Error: ${error.message}`, 'danger');
        setLoading(false);
      }
    };

    fetchFishDetails();
  }, [id, showAlert]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFishData({
        ...fishData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFishData({
        ...fishData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showAlert('A kép mérete maximum 5MB lehet!', 'danger');
    return;
  }
  
    setNewImage(file);
  
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updatedFishData = { ...fishData };
      
      if (newImage) {
        const base64Image = await convertImageToBase64(newImage);
        
        updatedFishData.kep = base64Image.split(',')[1];
      }
      
      await submitFishData(updatedFishData);
    } catch (error) {
      handleSubmitError(error);
    }
  };
  
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  const submitFishData = async (data) => {
    try {
      console.log('Küldendő adatok:', data);
      
      const response = await fetch(`https://halak.onrender.com/api/Halak/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Válasz státusz:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Szerver válasz:', errorText);
        
        throw new Error(errorText || `Hiba a feltöltés során: ${response.status} ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
  
      console.log('Sikeres válasz:', responseData);
      
      showAlert('Sikeresen szerkesztve!', 'success');
      setSaving(false);
      navigate(`/fish/${id}`);
    } catch (error) {
      console.error('Fetch hiba részletek:', error);
      throw error;
    }
  };
  
  const handleSubmitError = (error) => {
    console.error('Hiba a szerkesztés során:', error);
    setError(`Hiba a szerkesztés során: ${error.message}`);
    showAlert(`Error: ${error.message}`, 'danger');
    setSaving(false);
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

  if (error && !loading) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Edit Fish</h2>
          </div>
          
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nev" className="form-label">Név</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="nev" 
                  name="nev" 
                  value={fishData.nev} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="faj" className="form-label">Faj</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="faj" 
                  name="faj" 
                  value={fishData.faj} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="meretCm" className="form-label">Méret (cm)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="meretCm" 
                  name="meretCm" 
                  value={fishData.meretCm} 
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="toId" className="form-label">Tó ID</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="toId" 
                  name="toId" 
                  value={fishData.toId} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="kep" className="form-label">Hal Képe</label>
                <input 
                  type="file" 
                  className="form-control" 
                  id="kep" 
                  name="kep" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <small className="text-muted">Hagyd üresen ha nem akarod változtatni.</small>
              </div>
              
              {imagePreview && (
                <div className="mb-3 text-center">
                  <p><strong>Előnézet:</strong></p>
                  <img 
                    src={imagePreview} 
                    alt="Fish preview" 
                    className="img-fluid" 
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
              
              <div className="d-flex justify-content-between">
                <Link to={`/fish/${id}`} className="btn btn-secondary">
                  <i className="bi bi-x-circle me-1"></i> Mégse
                </Link>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i> Mentés
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalakEdit;