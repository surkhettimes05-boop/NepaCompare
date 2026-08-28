'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './Wizard.css';

const MAKES = ['Bajaj', 'Honda', 'Yamaha', 'TVS', 'Royal Enfield', 'Hero', 'Suzuki', 'KTM', 'Vespa'];
const STEP_NAMES = ['Vehicle type', 'Make and model', 'Registration details', 'Previous insurance'];

export default function MotorQuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ type: '2w', make: '', model: '', year: '', usage: 'private', ncb: '0' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(previous => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (step < 4) { setStep(current => current + 1); return; }
    setLoading(true);
    router.push(`/compare/motor?${new URLSearchParams(formData).toString()}`);
  };

  return <div className="wizard-wrapper glass-panel">
    <p className="sr-only" aria-live="polite">Step {step} of 4: {STEP_NAMES[step - 1]}</p>
    <ol className="wizard-progress" aria-label="Quote progress">
      <div className="wizard-progress-bar" style={{ width: `${((step - 1) / 3) * 100}%` }} aria-hidden="true" />
      {STEP_NAMES.map((name, index) => <li key={name} className={`wizard-step-indicator ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'completed' : ''}`} aria-current={step === index + 1 ? 'step' : undefined} aria-label={`Step ${index + 1}: ${name}`}>
        {step > index + 1 ? '✓' : index + 1}
      </li>)}
    </ol>

    <form onSubmit={handleSubmit}>
      <div className="wizard-step-content animate-fade-up">
        {step === 1 && <>
          <h2 className="heading-3" style={{ textAlign: 'center' }}>What type of vehicle do you have?</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Select one option. No contact details are required to browse.</p>
          <fieldset className="option-grid" aria-label="Vehicle type">
            <button type="button" className={`option-card ${formData.type === '2w' ? 'selected' : ''}`} onClick={() => setFormData(previous => ({ ...previous, type: '2w' }))} aria-pressed={formData.type === '2w'}>
              <span className="option-icon" aria-hidden="true">🏍️</span><span className="option-title">Two-Wheeler</span><span className="text-muted">Bike or scooter</span>
            </button>
            <button type="button" className={`option-card ${formData.type === '4w' ? 'selected' : ''}`} onClick={() => setFormData(previous => ({ ...previous, type: '4w' }))} aria-pressed={formData.type === '4w'}>
              <span className="option-icon" aria-hidden="true">🚗</span><span className="option-title">Four-Wheeler</span><span className="text-muted">Car or jeep</span>
            </button>
          </fieldset>
        </>}

        {step === 2 && <>
          <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '2rem' }}>Tell us about your vehicle</h2>
          <div className="input-group"><label className="input-label" htmlFor="motor-make">Vehicle make</label><select id="motor-make" name="make" value={formData.make} onChange={handleChange} className="input-field" required><option value="" disabled>Select brand</option>{MAKES.map(make => <option key={make} value={make.toLowerCase()}>{make}</option>)}<option value="other">Other brand</option></select></div>
          <div className="input-group"><label className="input-label" htmlFor="motor-model">Model name</label><input id="motor-model" name="model" value={formData.model} onChange={handleChange} className="input-field" required placeholder="e.g. Pulsar 150" /></div>
        </>}

        {step === 3 && <>
          <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '2rem' }}>Registration details</h2>
          <div className="input-group"><label className="input-label" htmlFor="motor-year">Registration year</label><input id="motor-year" type="number" name="year" value={formData.year} onChange={handleChange} className="input-field" required min="2000" max={new Date().getFullYear()} placeholder="e.g. 2021" /></div>
          <div className="input-group"><label className="input-label" htmlFor="motor-usage">Primary usage</label><select id="motor-usage" name="usage" value={formData.usage} onChange={handleChange} className="input-field" required><option value="private">Private / personal</option><option value="commercial">Commercial / delivery / rideshare</option></select></div>
        </>}

        {step === 4 && <>
          <h2 className="heading-3" style={{ textAlign: 'center' }}>Previous insurance</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Used only to prepare this comparison.</p>
          <div className="input-group"><label className="input-label" htmlFor="motor-ncb">Claims history</label><select id="motor-ncb" name="ncb" value={formData.ncb} onChange={handleChange} className="input-field" required><option value="0">Claim made last year / no NCB</option><option value="20">No claim for 1 year</option><option value="25">No claim for 2 years</option><option value="35">No claim for 3+ years</option></select></div>
          <p className="text-muted" style={{ fontSize: '.85rem' }}>Results are indicative and must be confirmed by the insurer. See our <a href="/disclaimer">comparison disclaimer</a>.</p>
        </>}

        <div className="wizard-actions">
          {step > 1 && <button type="button" className="btn btn-outline" onClick={() => setStep(current => current - 1)} disabled={loading}>Back</button>}
          <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>{loading ? 'Preparing comparison…' : step === 4 ? 'Compare plans' : 'Next'}</button>
        </div>
      </div>
    </form>
  </div>;
}
