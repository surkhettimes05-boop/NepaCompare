'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Wizard.css';

const MAKES = ['Bajaj', 'Honda', 'Yamaha', 'TVS', 'Royal Enfield', 'Hero', 'Suzuki', 'KTM', 'Vespa'];

export default function MotorQuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: '2w',
    make: '',
    model: '',
    year: '',
    usage: 'private',
    ncb: '0',
    name: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Build the query string for the comparison engine
    const query = new URLSearchParams({
      type: formData.type,
      make: formData.make,
      model: formData.model,
      year: formData.year,
      usage: formData.usage,
      ncb: formData.ncb,
      name: formData.name,
      phone: formData.phone,
    }).toString();

    // Route to comparison page with collected params
    router.push(`/compare/motor?${query}`);
  };

  return (
    <div className="wizard-wrapper glass-panel">
      
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="wizard-progress-bar" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        {[1, 2, 3, 4, 5].map((num) => (
          <div 
            key={num} 
            className={`wizard-step-indicator ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
          >
            {step > num ? '✓' : num}
          </div>
        ))}
      </div>

      <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        <div className="wizard-step-content animate-fade-up">
          
          {/* STEP 1: Vehicle Type */}
          {step === 1 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>What type of vehicle do you have?</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Select your vehicle category to proceed.</p>
              
              <div className="option-grid">
                <div 
                  className={`option-card ${formData.type === '2w' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('type', '2w')}
                >
                  <div className="option-icon">🏍️</div>
                  <div className="option-title">Two-Wheeler</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Bike, Scooter</div>
                </div>
                <div 
                  className={`option-card ${formData.type === '4w' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('type', '4w')}
                >
                  <div className="option-icon">🚗</div>
                  <div className="option-title">Four-Wheeler</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Car, Jeep</div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Make & Model */}
          {step === 2 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>Tell us about your vehicle</h3>
              
              <div className="input-group">
                <label className="input-label">Vehicle Make</label>
                <select name="make" value={formData.make} onChange={handleChange} className="input-field" required>
                  <option value="" disabled>Select Brand</option>
                  {MAKES.map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
                  <option value="other">Other Brand</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Model Name</label>
                <input 
                  type="text" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  placeholder="e.g. Pulsar 150, FZ-S" 
                />
              </div>
            </>
          )}

          {/* STEP 3: Year & Usage */}
          {step === 3 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>Registration Details</h3>
              
              <div className="input-group">
                <label className="input-label">Registration Year</label>
                <input 
                  type="number" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  min="2000"
                  max={new Date().getFullYear()}
                  placeholder="e.g. 2021" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Primary Usage</label>
                <select name="usage" value={formData.usage} onChange={handleChange} className="input-field" required>
                  <option value="private">Private (Personal use)</option>
                  <option value="commercial">Commercial (Delivery, Rideshare)</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 4: Previous Policy & NCB */}
          {step === 4 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Previous Insurance Status</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>This helps calculate your No Claim Bonus discounts.</p>
              
              <div className="input-group">
                <label className="input-label">Did you claim insurance last year?</label>
                <select name="ncb" value={formData.ncb} onChange={handleChange} className="input-field" required>
                  <option value="0">Yes, I made a claim (0% NCB)</option>
                  <option value="20">No claim for 1 year (20% NCB)</option>
                  <option value="25">No claim for 2 years (25% NCB)</option>
                  <option value="35">No claim for 3+ years (35% NCB)</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 5: Contact details */}
          {step === 5 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Almost Done!</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Where should we send your quotes?</p>
              
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  placeholder="Rajesh Shrestha" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number (Nepal)</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  placeholder="+977 98XXXXXXXX" 
                />
              </div>
            </>
          )}
          
          <div className="wizard-actions">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={prevStep} disabled={loading}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Processing...' : step === 5 ? 'Get Quotes' : 'Next'}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}
