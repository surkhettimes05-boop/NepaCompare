'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Wizard.css';

export default function HealthQuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    coverageType: 'self',
    dependents: '0',
    age: '',
    preExistingConditions: 'false',
    sumAssured: '500000',
    name: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-set dependents based on coverage type
    if (name === 'coverageType') {
      if (value === 'self') setFormData(prev => ({ ...prev, dependents: '0' }));
      else if (value === 'couple') setFormData(prev => ({ ...prev, dependents: '1' }));
      else if (value === 'family') setFormData(prev => ({ ...prev, dependents: '3' }));
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const query = new URLSearchParams({
      dependents: formData.dependents,
      age: formData.age,
      preExistingConditions: formData.preExistingConditions,
      sumAssured: formData.sumAssured,
      name: formData.name,
      phone: formData.phone,
    }).toString();

    router.push(`/compare/health?${query}`);
  };

  return (
    <div className="wizard-wrapper glass-panel">
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
          
          {/* STEP 1: Insured Members */}
          {step === 1 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Who are you insuring?</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Select the coverage type.</p>
              
              <div className="option-grid">
                <div 
                  className={`option-card ${formData.coverageType === 'self' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('coverageType', 'self')}
                >
                  <div className="option-icon">👤</div>
                  <div className="option-title">Self</div>
                </div>
                <div 
                  className={`option-card ${formData.coverageType === 'couple' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('coverageType', 'couple')}
                >
                  <div className="option-icon">👥</div>
                  <div className="option-title">Couple</div>
                </div>
                <div 
                  className={`option-card ${formData.coverageType === 'family' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('coverageType', 'family')}
                >
                  <div className="option-icon">👨‍👩‍👧‍👦</div>
                  <div className="option-title">Family</div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Age */}
          {step === 2 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>Age Details</h3>
              
              <div className="input-group">
                <label className="input-label">Age of Eldest Member</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  min="18"
                  max="80"
                  placeholder="e.g. 35" 
                />
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Premium is primarily based on the eldest member.</p>
              </div>
            </>
          )}

          {/* STEP 3: Pre-existing conditions */}
          {step === 3 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>Medical History</h3>
              
              <div className="input-group">
                <label className="input-label">Does any member have pre-existing conditions?</label>
                <select name="preExistingConditions" value={formData.preExistingConditions} onChange={handleChange} className="input-field" required>
                  <option value="false">No, everyone is healthy</option>
                  <option value="true">Yes (e.g. Diabetes, Hypertension)</option>
                </select>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Declaring this ensures your claims won't be rejected later.</p>
              </div>
            </>
          )}

          {/* STEP 4: Sum Assured */}
          {step === 4 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Coverage Amount</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>How much medical cover do you need?</p>
              
              <div className="input-group">
                <label className="input-label">Sum Assured</label>
                <select name="sumAssured" value={formData.sumAssured} onChange={handleChange} className="input-field" required>
                  <option value="300000">NPR 3 Lakhs (Basic)</option>
                  <option value="500000">NPR 5 Lakhs (Standard)</option>
                  <option value="1000000">NPR 10 Lakhs (Recommended)</option>
                  <option value="2000000">NPR 20 Lakhs (Comprehensive)</option>
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
