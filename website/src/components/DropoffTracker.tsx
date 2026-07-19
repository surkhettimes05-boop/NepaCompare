'use client';
import { useEffect } from 'react';

export default function DropoffTracker({ vertical }: { vertical: string }) {
  useEffect(() => {
    // 30 second timer for drop-off detection
    const timer = setTimeout(async () => {
      const token = localStorage.getItem('customer_token');
      const userStr = localStorage.getItem('customer_user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
          
          await fetch(`${apiUrl}/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              vertical,
              source: 'web',
              formData: { 
                name: user.name, 
                phone: user.phone, 
                isUrgent: true,
                note: 'User abandoned comparison page after 30 seconds.'
              },
              userId: user.id
            })
          });
          console.log('Drop-off lead pinged to CRM');
        } catch (e) {
          console.error(e);
        }
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, [vertical]);

  return null;
}
