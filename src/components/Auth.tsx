'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

interface Profile {
  username: string;
  first_name: string;
  last_name: string;
}

export default function Auth() {
  const supabase = createClient();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<Profile>({ username: '', first_name: '', last_name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'http://rankeddaily.com/password-reset' });
    setLoading(false);
    if (error) setError(error.message);
    else setResetSent(true);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
    if (error) setError(error.message);
  };

  const handleSignUp = async () => {
    setProfileError('');
    setError('');
    setLoading(true);

    const { data: usernameData, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', profile.username);

    if (usernameError) {
      setLoading(false);
      return setError(usernameError.message);
    }
    if (usernameData && usernameData.length > 0) {
      setLoading(false);
      return setProfileError('Username is already taken.');
    }

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setLoading(false);
      return setError(signUpError.message);
    }
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert({ id: user.id, ...profile });
      if (profileError) {
        setLoading(false);
        return setError(profileError.message);
      }
      router.refresh(); // Refresh the page to update the user state
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.refresh();
    setLoading(false);
  };

  return (
    <>
      <Button variant="primary" onClick={() => {setShow(true); setIsLogin(true);}}>Sign In</Button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? 'Login' : 'Sign Up'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {resetSent && <Alert variant="success">Password reset link sent to your email.</Alert>}
          {isLogin ? (
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin} disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
              <Button variant="link" onClick={handlePasswordReset}>Forgot Password?</Button>
              <Button variant="secondary" onClick={handleGoogleLogin}>Login with Google</Button>
            </Form>
          ) : (
            <Form>
              {profileError && <Alert variant="danger">{profileError}</Alert>}
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="First Name" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formBasicLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Last Name" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={handleSignUp} disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
