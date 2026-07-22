'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Wizard.css';

export default function LifeQuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    goal: 'family_security',
    sumAssured: '5000000',
    age: '',
    smoker: 'false',
    income: 'below_5lakhs',
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
    
    const query = new URLSearchParams({
      goal: formData.goal,
      sumAssured: formData.sumAssured,
      age: formData.age,
      smoker: formData.smoker,
      income: formData.income,
      name: formData.name,
      phone: formData.phone,
    }).toString();

    router.push(`/compare/life?${query}`);
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
          
          {/* STEP 1: Goal */}
          {step === 1 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>What's your primary goal?</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>This helps us recommend the right type of life insurance.</p>
              
              <div className="option-grid">
                <div 
                  className={`option-card ${formData.goal === 'family_security' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('goal', 'family_security')}
                >
                  <div className="option-icon">🛡️</div>
                  <div className="option-title">Family Security</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Pure Protection (Term Life)</div>
                </div>
                <div 
                  className={`option-card ${formData.goal === 'investment' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('goal', 'investment')}
                >
                  <div className="option-icon">📈</div>
                  <div className="option-title">Investment & Savings</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Endowment / Money Back</div>
                </div>
                <div 
                  className={`option-card ${formData.goal === 'loan_protection' ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect('goal', 'loan_protection')}
                >
                  <div className="option-icon">🏦</div>
                  <div className="option-title">Loan Protection</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>Decreasing Term</div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Sum Assured */}
          {step === 2 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Desired Life Cover</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>How much money should your family receive?</p>
              
              <div className="input-group">
                <label className="input-label">Sum Assured</label>
                <select name="sumAssured" value={formData.sumAssured} onChange={handleChange} className="input-field" required>
                  <option value="1000000">NPR 10 Lakhs (Basic)</option>
                  <option value="2500000">NPR 25 Lakhs (Standard)</option>
                  <option value="5000000">NPR 50 Lakhs (Recommended)</option>
                  <option value="10000000">NPR 1 Crore (Comprehensive)</option>
                </select>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Rule of thumb: 10x your annual income.</p>
              </div>
            </>
          )}

          {/* STEP 3: Age & Smoking */}
          {step === 3 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '2rem', textAlign: 'center' }}>Health Profile</h3>
              
              <div className="input-group">
                <label className="input-label">Your Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  className="input-field" 
                  required 
                  min="18"
                  max="65"
                  placeholder="e.g. 30" 
                />
              </div>

              <div className="input-group">
                <label className="input-label">Do you smoke or consume tobacco?</label>
                <select name="smoker" value={formData.smoker} onChange={handleChange} className="input-field" required>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Smokers typically pay higher premiums for life insurance.</p>
              </div>
            </>
          )}

          {/* STEP 4: Income */}
          {step === 4 && (
            <>
              <h3 className="heading-3" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Financial Details</h3>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Insurers use this to validate your requested cover amount.</p>
              
              <div className="input-group">
                <label className="input-label">Annual Income</label>
                <select name="income" value={formData.income} onChange={handleChange} className="input-field" required>
                  <option value="below_5lakhs">Below NPR 5 Lakhs</option>
                  <option value="5_to_10_lakhs">NPR 5 Lakhs - 10 Lakhs</option>
                  <option value="10_to_20_lakhs">NPR 10 Lakhs - 20 Lakhs</option>
                  <option value="above_20_lakhs">Above NPR 20 Lakhs</option>
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
