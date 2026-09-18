'use client';

import { useEffect, useMemo, useState } from 'react';
import './Wizard.css';

type VehicleType = 'car' | 'motorcycle' | 'commercial' | 'other';
type InsuranceStatus = 'new' | 'renewal';
type CoverageType = 'third-party' | 'comprehensive' | 'custom';

type MotorFormData = {
  vehicleType: VehicleType | '';
  registrationNumber: string;
  make: string;
  model: string;
  manufacturingYear: string;
  registrationYear: string;
  engineCc: string;
  fuelType: string;
  insuranceStatus: InsuranceStatus | '';
  previousInsurer: string;
  previousPolicyNumber: string;
  expiryDate: string;
  coverageType: CoverageType | '';
  addOns: string[];
  fullName: string;
  phone: string;
  email: string;
  address: string;
  consent: boolean;
};

const STORAGE_KEY = 'khaacho_motor_funnel_v1';
const STEP_NAMES = [
  'Vehicle type',
  'Vehicle details',
  'Existing insurance',
  'Coverage',
  'Customer',
  'Submit request',
];
const MAKES = ['Honda', 'Bajaj', 'Yamaha', 'Suzuki', 'TVS', 'Hyundai', 'Toyota', 'Kia', 'Tata', 'Mahindra', 'Other'];
const ADD_ONS = ['Zero dep', 'Personal accident', 'Roadside assistance', 'Theft', 'Accessories cover'];

const emptyForm: MotorFormData = {
  vehicleType: '',
  registrationNumber: '',
  make: '',
  model: '',
  manufacturingYear: '',
  registrationYear: '',
  engineCc: '',
  fuelType: '',
  insuranceStatus: '',
  previousInsurer: '',
  previousPolicyNumber: '',
  expiryDate: '',
  coverageType: '',
  addOns: [],
  fullName: '',
  phone: '',
  email: '',
  address: '',
  consent: false,
};

export default function MotorQuoteWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<MotorFormData>(emptyForm);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<MotorFormData>;
        setFormData({ ...emptyForm, ...parsed });
      } catch {
        // Ignore invalid cached state.
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const currentStepLabel = useMemo(() => STEP_NAMES[step - 1], [step]);

  const updateField = (field: keyof MotorFormData, value: string | boolean | string[]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const toggleAddOn = (addOn: string) => {
    setFormData((previous) => {
      const exists = previous.addOns.includes(addOn);
      return { ...previous, addOns: exists ? previous.addOns.filter((item) => item !== addOn) : [...previous.addOns, addOn] };
    });
  };

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 1 && !formData.vehicleType) {
      nextErrors.vehicleType = 'Please select a vehicle type.';
    }

    if (step === 2) {
      if (!formData.registrationNumber.trim()) nextErrors.registrationNumber = 'Registration number is required.';
      if (!formData.make.trim()) nextErrors.make = 'Vehicle make is required.';
      if (!formData.model.trim()) nextErrors.model = 'Vehicle model is required.';
      if (!formData.manufacturingYear.trim()) nextErrors.manufacturingYear = 'Manufacturing year is required.';
      if (!formData.registrationYear.trim()) nextErrors.registrationYear = 'Registration year is required.';
      if (formData.vehicleType === 'commercial' && !formData.fuelType.trim()) nextErrors.fuelType = 'Fuel/type is required for commercial vehicles.';
    }

    if (step === 3) {
      if (!formData.insuranceStatus) nextErrors.insuranceStatus = 'Please select your insurance status.';
      if (formData.insuranceStatus === 'renewal') {
        if (!formData.previousInsurer.trim()) nextErrors.previousInsurer = 'Previous insurer is required for renewals.';
        if (!formData.previousPolicyNumber.trim()) nextErrors.previousPolicyNumber = 'Previous policy number is required.';
        if (!formData.expiryDate) nextErrors.expiryDate = 'Expiry date is required.';
      }
    }

    if (step === 4 && !formData.coverageType) {
      nextErrors.coverageType = 'Please choose a coverage option.';
    }

    if (step === 5) {
      if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
      if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required.';
      if (!/^[+\d()\-\s]{7,}$/.test(formData.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
      if (!formData.email.trim()) nextErrors.email = 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (!formData.address.trim()) nextErrors.address = 'Address is required.';
      if (!formData.consent) nextErrors.consent = 'Consent is required before we can contact you.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, STEP_NAMES.length));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setErrors({});

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const payload = {
        vertical: 'motor',
        source: 'website_motor_funnel',
        formData: {
          ...formData,
          insuranceStatus: formData.insuranceStatus || 'new',
          addOns: formData.addOns,
          consentTs: new Date().toISOString(),
        },
      };

      const response = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to submit your motor insurance request. Please try again.');
      }

      const generatedReference = `KHA-${Date.now().toString().slice(-6)}`;
      setReferenceNumber(generatedReference);
      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('khaacho:lead_submitted', { detail: { vertical: 'motor', reference: generatedReference } }));
      }
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Unable to submit your request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="wizard-wrapper glass-panel" aria-live="polite">
        <div className="success-state" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">✓</div>
          <h2 className="heading-3">Request received</h2>
          <p className="text-muted" style={{ margin: '1rem 0 1.5rem' }}>
            Your request has been received. Khaacho will obtain available quotes.
          </p>
          <div className="reference-box" style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '0.9rem 1rem', marginBottom: '1rem' }}>
            <span style={{ display: 'block', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-tertiary)' }}>Reference number</span>
            <strong style={{ fontSize: '1.2rem' }}>{referenceNumber || 'KHA-REQUEST'}</strong>
          </div>
          <p className="text-muted" style={{ fontSize: '.9rem' }}>
            A confirmation will be sent to {formData.email || formData.phone || 'your contact details'}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-wrapper glass-panel">
      <p className="sr-only" aria-live="polite">Step {step} of {STEP_NAMES.length}: {currentStepLabel}</p>
      <ol className="wizard-progress" aria-label="Motor insurance request progress">
        <div className="wizard-progress-bar" style={{ width: `${((step - 1) / (STEP_NAMES.length - 1)) * 100}%` }} aria-hidden="true" />
        {STEP_NAMES.map((name, index) => (
          <li key={name} className={`wizard-step-indicator ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'completed' : ''}`} aria-current={step === index + 1 ? 'step' : undefined} aria-label={`Step ${index + 1}: ${name}`}>
            {step > index + 1 ? '✓' : index + 1}
          </li>
        ))}
      </ol>

      {errors.submit && (
        <div className="error-banner" role="alert" style={{ marginBottom: '1rem' }}>
          {errors.submit}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (step < STEP_NAMES.length) {
            handleNext();
            return;
          }
          void handleSubmit();
        }}
      >
        <div className="wizard-step-content animate-fade-up">
          {step === 1 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center' }}>Step 1: Vehicle type</h2>
              <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>Tell us what kind of vehicle you need insured.</p>
              <fieldset className="option-grid" aria-label="Vehicle type">
                {[
                  { value: 'car', label: 'Car', icon: '🚗' },
                  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
                  { value: 'commercial', label: 'Commercial vehicle', icon: '🚚' },
                  { value: 'other', label: 'Other', icon: '⚙️' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`option-card ${formData.vehicleType === option.value ? 'selected' : ''}`}
                    onClick={() => updateField('vehicleType', option.value)}
                    aria-pressed={formData.vehicleType === option.value}
                    aria-label={option.label}
                  >
                    <span className="option-icon" aria-hidden="true">{option.icon}</span>
                    <span className="option-title">{option.label}</span>
                    <span className="text-muted">{option.value === 'commercial' ? 'For business use' : 'Vehicle type'}</span>
                  </button>
                ))}
              </fieldset>
              {errors.vehicleType && <div className="error-text">{errors.vehicleType}</div>}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Step 2: Vehicle details</h2>
              <div className="input-group">
                <label className="input-label" htmlFor="registrationNumber">Registration number</label>
                <input id="registrationNumber" value={formData.registrationNumber} onChange={(event) => updateField('registrationNumber', event.target.value)} className="input-field" placeholder="e.g. BA 2 CHA 1234" />
                {errors.registrationNumber && <div className="error-text">{errors.registrationNumber}</div>}
              </div>
              <div className="input-grid two-column">
                <div className="input-group">
                  <label className="input-label" htmlFor="make">Make</label>
                  <select id="make" value={formData.make} onChange={(event) => updateField('make', event.target.value)} className="input-field">
                    <option value="">Select make</option>
                    {MAKES.map((make) => <option key={make} value={make}>{make}</option>)}
                  </select>
                  {errors.make && <div className="error-text">{errors.make}</div>}
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="model">Model</label>
                  <input id="model" value={formData.model} onChange={(event) => updateField('model', event.target.value)} className="input-field" placeholder="e.g. Civic, Pulsar 150" />
                  {errors.model && <div className="error-text">{errors.model}</div>}
                </div>
              </div>
              <div className="input-grid two-column">
                <div className="input-group">
                  <label className="input-label" htmlFor="manufacturingYear">Manufacturing year</label>
                  <input id="manufacturingYear" type="number" min="1990" max="2035" value={formData.manufacturingYear} onChange={(event) => updateField('manufacturingYear', event.target.value)} className="input-field" placeholder="2021" />
                  {errors.manufacturingYear && <div className="error-text">{errors.manufacturingYear}</div>}
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="registrationYear">Registration year</label>
                  <input id="registrationYear" type="number" min="1990" max="2035" value={formData.registrationYear} onChange={(event) => updateField('registrationYear', event.target.value)} className="input-field" placeholder="2022" />
                  {errors.registrationYear && <div className="error-text">{errors.registrationYear}</div>}
                </div>
              </div>
              <div className="input-grid two-column">
                <div className="input-group">
                  <label className="input-label" htmlFor="engineCc">Engine / CC</label>
                  <input id="engineCc" value={formData.engineCc} onChange={(event) => updateField('engineCc', event.target.value)} className="input-field" placeholder="e.g. 150cc / 1.6L" />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="fuelType">Fuel / type</label>
                  <input id="fuelType" value={formData.fuelType} onChange={(event) => updateField('fuelType', event.target.value)} className="input-field" placeholder="Petrol, diesel, EV, etc." />
                  {errors.fuelType && <div className="error-text">{errors.fuelType}</div>}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Step 3: Existing insurance</h2>
              <fieldset className="option-grid" aria-label="Insurance status">
                {[
                  { value: 'new', label: 'New', icon: '🆕' },
                  { value: 'renewal', label: 'Renewal', icon: '🔄' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`option-card ${formData.insuranceStatus === option.value ? 'selected' : ''}`}
                    onClick={() => updateField('insuranceStatus', option.value)}
                    aria-pressed={formData.insuranceStatus === option.value}
                    aria-label={option.label}
                  >
                    <span className="option-icon" aria-hidden="true">{option.icon}</span>
                    <span className="option-title">{option.label}</span>
                  </button>
                ))}
              </fieldset>
              {errors.insuranceStatus && <div className="error-text">{errors.insuranceStatus}</div>}

              {formData.insuranceStatus === 'renewal' && (
                <>
                  <div className="input-group">
                    <label className="input-label" htmlFor="previousInsurer">Previous insurer</label>
                    <input id="previousInsurer" value={formData.previousInsurer} onChange={(event) => updateField('previousInsurer', event.target.value)} className="input-field" placeholder="e.g. Neco Insurance" />
                    {errors.previousInsurer && <div className="error-text">{errors.previousInsurer}</div>}
                  </div>
                  <div className="input-grid two-column">
                    <div className="input-group">
                      <label className="input-label" htmlFor="previousPolicyNumber">Previous policy number</label>
                      <input id="previousPolicyNumber" value={formData.previousPolicyNumber} onChange={(event) => updateField('previousPolicyNumber', event.target.value)} className="input-field" placeholder="Policy number" />
                      {errors.previousPolicyNumber && <div className="error-text">{errors.previousPolicyNumber}</div>}
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="expiryDate">Expiry date</label>
                      <input id="expiryDate" type="date" value={formData.expiryDate} onChange={(event) => updateField('expiryDate', event.target.value)} className="input-field" />
                      {errors.expiryDate && <div className="error-text">{errors.expiryDate}</div>}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Step 4: Coverage</h2>
              <fieldset className="option-grid" aria-label="Coverage type">
                {[
                  { value: 'third-party', label: 'Third-party', icon: '🛡️' },
                  { value: 'comprehensive', label: 'Comprehensive', icon: '✅' },
                  { value: 'custom', label: 'Custom cover', icon: '⚙️' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`option-card ${formData.coverageType === option.value ? 'selected' : ''}`}
                    onClick={() => updateField('coverageType', option.value)}
                    aria-pressed={formData.coverageType === option.value}
                    aria-label={option.label}
                  >
                    <span className="option-icon" aria-hidden="true">{option.icon}</span>
                    <span className="option-title">{option.label}</span>
                  </button>
                ))}
              </fieldset>
              {errors.coverageType && <div className="error-text">{errors.coverageType}</div>}

              <div className="input-group" style={{ marginTop: '1.5rem' }}>
                <label className="input-label">Add-ons</label>
                <div className="option-grid compact" aria-label="Add-ons selection">
                  {ADD_ONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`chip ${formData.addOns.includes(item) ? 'selected' : ''}`}
                      onClick={() => toggleAddOn(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Step 5: Customer</h2>
              <div className="input-group">
                <label className="input-label" htmlFor="fullName">Full name</label>
                <input id="fullName" value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} className="input-field" placeholder="Full name" />
                {errors.fullName && <div className="error-text">{errors.fullName}</div>}
              </div>
              <div className="input-grid two-column">
                <div className="input-group">
                  <label className="input-label" htmlFor="phone">Phone</label>
                  <input id="phone" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className="input-field" placeholder="+977 98XXXXXXXX" />
                  {errors.phone && <div className="error-text">{errors.phone}</div>}
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="email">Email</label>
                  <input id="email" type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="input-field" placeholder="you@example.com" />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="address">Address</label>
                <textarea id="address" value={formData.address} onChange={(event) => updateField('address', event.target.value)} className="input-field" rows={3} placeholder="Your full address" />
                {errors.address && <div className="error-text">{errors.address}</div>}
              </div>
              <label className="consent-row" htmlFor="consent">
                <input id="consent" type="checkbox" checked={formData.consent} onChange={(event) => updateField('consent', event.target.checked)} />
                <span>I agree to being contacted by Khaacho about my insurance request and consent to the privacy policy.</span>
              </label>
              {errors.consent && <div className="error-text">{errors.consent}</div>}
            </>
          )}

          {step === 6 && (
            <>
              <h2 className="heading-3" style={{ textAlign: 'center', marginBottom: '1rem' }}>Step 6: Submit request</h2>
              <div className="summary-card" style={{ background: 'var(--bg-surface)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                <p><strong>Vehicle:</strong> {formData.vehicleType || 'Not selected'}</p>
                <p><strong>Registration:</strong> {formData.registrationNumber || 'Not provided'}</p>
                <p><strong>Make / model:</strong> {formData.make || 'Not provided'} / {formData.model || 'Not provided'}</p>
                <p><strong>Coverage:</strong> {formData.coverageType || 'Not selected'}</p>
                <p><strong>Customer:</strong> {formData.fullName || 'Not provided'}</p>
              </div>
              <p className="text-muted">No fake prices are displayed. If providers are not connected, Khaacho will obtain available quotes on your behalf.</p>
            </>
          )}

          <div className="wizard-actions">
            {step > 1 && (
              <button type="button" className="btn btn-outline" onClick={() => setStep((current) => Math.max(current - 1, 1))} disabled={loading}>
                Back
              </button>
            )}
            {step < STEP_NAMES.length ? (
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit request'}
              </button>
            )}
          </div>
          <div className="helper-text" style={{ marginTop: '0.9rem', textAlign: 'center' }}>Draft saved locally for resume.</div>
        </div>
      </form>
    </div>
  );
}
