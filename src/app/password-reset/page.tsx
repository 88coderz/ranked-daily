'use client';

import { useState, useEffect } from 'react';
import { createClient } from './utils/supabase/client'; // Adjust this path as needed
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const supabase = createClient();

export default function PasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter();
 
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session:Session ) => {
        if (event === 'PASSWORD_RECOVERY') {
          // This event is triggered when the user lands on this page from the email link
          setUser(session?.user ?? null);
          setMessage('Please enter your new password.');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!user) {
      setError('Invalid or expired password reset link. Please request a new one.');
      setLoading(false);
      return;
    }

    // Update the user's password using the temporary session
    const { data, error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Your password has been updated successfully!');
      // Redirect to the login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Card className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Password Recovery</h2>
            <Alert variant="danger">
              Invalid or expired link. Please request a new password reset email.
            </Alert>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          
          <Form onSubmit={handlePasswordUpdate}>
            <Form.Group id="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="confirm-password" className="mt-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}