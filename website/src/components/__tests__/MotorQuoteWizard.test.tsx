import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MotorQuoteWizard from '../MotorQuoteWizard';

describe('MotorQuoteWizard', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  it('validates required fields before advancing', async () => {
    render(<MotorQuoteWizard />);

    fireEvent.click(screen.getByRole('button', { name: /car/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText('Registration number is required.')).toBeInTheDocument();
  });

  it('completes the full motor funnel and shows the receipt state', async () => {
    render(<MotorQuoteWizard />);

    fireEvent.click(screen.getByRole('button', { name: /car/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await userEvent.type(screen.getByLabelText('Registration number'), 'BA 2 CHA 1234');
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'Honda');
    await userEvent.type(screen.getByLabelText('Model'), 'Civic');
    await userEvent.type(screen.getByLabelText('Manufacturing year'), '2021');
    await userEvent.type(screen.getByLabelText('Registration year'), '2022');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    fireEvent.click(screen.getByRole('button', { name: /new/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    fireEvent.click(screen.getByRole('button', { name: /third-party/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await userEvent.type(screen.getByLabelText('Full name'), 'Rita Shrestha');
    await userEvent.type(screen.getByLabelText('Phone'), '+977 9800000000');
    await userEvent.type(screen.getByLabelText('Email'), 'rita@example.com');
    await userEvent.type(screen.getByLabelText('Address'), 'Kathmandu, Nepal');
    fireEvent.click(screen.getByLabelText(/I agree to being contacted/i));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => {
      expect(screen.getByText('Request received')).toBeInTheDocument();
    });

    expect(screen.getByText(/Your request has been received/i)).toBeInTheDocument();
    expect(screen.getByText('Reference number')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const payload = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
    expect(payload.vertical).toBe('motor');
    expect(payload.formData.fullName).toBe('Rita Shrestha');
    expect(payload.formData.consent).toBe(true);
  });
});
