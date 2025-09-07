'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';

export default function PasswordResetClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // The user is in the password recovery flow.
        // The session should be automatically set by the library.
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);


  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    // The session should be set automatically by the onAuthStateChange listener
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Your password has been updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    setLoading(false);
  };

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