'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import './LeadForm.css';

export default function LeadForm() {
  const searchParams = useSearchParams();
  const vertical = searchParams.get('vertical') || 'unknown';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pointing to the NestJS API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      const token = localStorage.getItem('customer_token');
      const userStr = localStorage.getItem('customer_user');
      let userId = undefined;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      if (token && userStr) {
        headers['Authorization'] = `Bearer ${token}`;
        userId = JSON.parse(userStr).id;
      }

      const response = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          vertical,
          source: 'web',
          formData: {
            name: formData.name,
            phone: formData.phone,
            age: formData.age,
          },
          userId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="lead-form-wrapper glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h3 className="heading-3">Quote Requested!</h3>
        <p className="text-muted" style={{ marginTop: '1rem' }}>
          Thank you, {formData.name}. We've received your request and will be in touch at {formData.phone} to discuss your options.
        </p>
      </div>
    );
  }

  return (
    <div className="lead-form-wrapper glass-panel">
      <div className="form-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
      </div>

      {error && (
        <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--warning)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: 'var(--warning)', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={step === 1 ? handleNext : handleSubmit}>
        {step === 1 && (
          <div className="form-step animate-fade-up">
            <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Basic Details</h3>
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-field" required placeholder="Rajesh Shrestha" />
            </div>
            <div className="input-group">
              <label htmlFor="phone" className="input-label">Phone Number (Nepal)</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="input-field" required placeholder="+977 98XXXXXXXX" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step animate-fade-up">
            <h3 className="heading-3" style={{ marginBottom: '1.5rem' }}>Finalize Quote</h3>
            <div className="input-group">
              <label htmlFor="age" className="input-label">Age</label>
              <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="input-field" required placeholder="30" />
            </div>
            <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="consent" id="consent" checked={formData.consent} onChange={handleChange} required style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="consent" className="input-label" style={{ fontSize: '0.8rem' }}>
                I consent to NepaCompare and relevant insurers contacting me regarding this quote request.
              </label>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={loading}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Request Quote'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
