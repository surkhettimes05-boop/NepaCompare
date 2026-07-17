import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadForm from '../LeadForm';

// Mock the Next.js useSearchParams hook
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue('health')
  })
}));

describe('LeadForm Component', () => {
  beforeEach(() => {
    // Reset global fetch mock
    global.fetch = jest.fn();
  });

  it('renders Step 1 correctly', () => {
    render(<LeadForm />);
    expect(screen.getByText('Basic Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number (Nepal)')).toBeInTheDocument();
  });

  it('progresses to Step 2 when Step 1 is filled and submitted', async () => {
    render(<LeadForm />);
    
    // Fill out Step 1
    await userEvent.type(screen.getByLabelText('Full Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Phone Number (Nepal)'), '9800000000');
    
    // Submit Step 1
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }));
    
    // Verify Step 2 is visible
    expect(screen.getByText('Finalize Quote')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
  });

  it('successfully submits the form and shows success state', async () => {
    // Mock fetch to return a successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '123' })
    });

    render(<LeadForm />);
    
    // Step 1
    await userEvent.type(screen.getByLabelText('Full Name'), 'Sita Gurung');
    await userEvent.type(screen.getByLabelText('Phone Number (Nepal)'), '9850000000');
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }));
    
    // Step 2
    await userEvent.type(screen.getByLabelText('Age'), '28');
    const consentCheckbox = screen.getByRole('checkbox');
    await userEvent.click(consentCheckbox);
    
    // Submit Step 2
    fireEvent.submit(screen.getByRole('button', { name: /request quote/i }));
    
    // Wait for success screen
    await waitFor(() => {
      expect(screen.getByText('Quote Requested!')).toBeInTheDocument();
    });
    
    // Verify fetch was called with correct payload
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchArgs[1].method).toBe('POST');
    
    const body = JSON.parse(fetchArgs[1].body);
    expect(body.vertical).toBe('health');
    expect(body.formData.name).toBe('Sita Gurung');
  });
});
