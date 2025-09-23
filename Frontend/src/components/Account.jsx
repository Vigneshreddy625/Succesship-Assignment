import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Account = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // create form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hobby, setHobby] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // forms list state
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [listError, setListError] = useState("");

  const fetchForms = async () => {
    setListError("");
    setLoadingForms(true);
    try {
      const { data } = await axios.get(`${apiUrl}/api/forms`, { withCredentials: true });
      setForms(Array.isArray(data.forms) ? data.forms : []);
    } catch (e) {
      setListError(e?.response?.data?.message || "Failed to fetch forms");
    } finally {
      setLoadingForms(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleLogout = async () => {
    await logout();
    // Redirect to login page after logout
    navigate('/login', { replace: true });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await axios.post(`${apiUrl}/api/forms`, {
        name,
        email,
        hobby,
        age: Number(age),
        phoneNumber
      }, { withCredentials: true });
      setName("");
      setEmail("");
      setHobby("");
      setAge("");
      setPhoneNumber("");
      await fetchForms();
    } catch (e) {
      setSubmitError(e?.response?.data?.message || "Failed to create form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>Account</div>
        <button 
          onClick={handleLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.target.style.background = '#b91c1c'}
          onMouseOut={(e) => e.target.style.background = '#dc2626'}
        >
          Logout
        </button>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginBottom: 12, fontWeight: 600 }}>Create Form</h3>
          {submitError && (
            <div style={{ marginBottom: 12, color: '#b91c1c' }}>{submitError}</div>
          )}
          <form onSubmit={onSubmitForm} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Hobby</label>
              <input value={hobby} onChange={(e) => setHobby(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Age</label>
              <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>Phone Number</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
            </div>
            <div style={{ alignSelf: 'end' }}>
              <button type="submit" disabled={submitting} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 14px', borderRadius: 6, cursor: 'pointer' }}>
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </section>

        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontWeight: 600 }}>Your Forms</h3>
            <button onClick={fetchForms} style={{ border: '1px solid #e5e7eb', padding: '6px 10px', borderRadius: 6, background: 'white', cursor: 'pointer' }}>Refresh</button>
          </div>
          {listError && (
            <div style={{ marginBottom: 12, color: '#b91c1c' }}>{listError}</div>
          )}
          {loadingForms ? (
            <div>Loading...</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {forms.map((f) => (
                <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{f.email} • Age {f.age} • {f.hobby}</div>
                  </div>
                  <button onClick={() => navigate(`/sheets/connect/${f._id}`)} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Connect Google</button>
                </div>
              ))}
              {forms.length === 0 && (
                <div style={{ color: '#6b7280' }}>No forms yet. Create one above.</div>
              )}
            </div>
          )}
        </section>
      </div>

      <Outlet />
    </div>
  );
};

export default Account;


