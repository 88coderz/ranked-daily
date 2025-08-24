import React, { useState } from 'react';
import { Form, Button, Alert, Modal, Image } from 'react-bootstrap';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  avatar_url?: string;
}

interface Props {
  onAuth: (user: UserProfile) => void;
  showSignIn: boolean;
  setShowSignIn: (show: boolean) => void;
  showSignUp: boolean;
  setShowSignUp: (show: boolean) => void;
  user?: UserProfile | null;
}

const Auth: React.FC<Props> = ({ onAuth, showSignIn, setShowSignIn, showSignUp, setShowSignUp, user }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [verifySent, setVerifySent] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<{ name: string; contact: string; username: string }>({ name: '', contact: '', username: '' });
  const [profileError, setProfileError] = useState<string>('');

  const handlePasswordReset = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
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
    // After redirect, check if user profile is complete, prompt for missing info if needed
  };

  const handleSignUp = async () => {
    setProfileError('');
    setError('');
    setLoading(true);

    // Check for duplicate username
    const { data: usernameData, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', profile.username);

    if (usernameData && usernameData.length > 0) {
      setProfileError('Username already taken. Please choose another.');
      setLoading(false);
      return;
    }

    // Proceed with signup
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // Save profile info
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        name: profile.name,
        contact: profile.contact,
        username: profile.username,
        user_id: signupData.user?.id || null,
      });

    setLoading(false);

    if (insertError) {
      setProfileError(insertError.message);
    } else {
      setShowSignUp(false);
      setVerifySent(true);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    setProfileError('');
    setLoading(true);

    // Validate fields
    if (!profile.name || !profile.contact || !profile.username) {
      setProfileError('All fields are required.');
      setLoading(false);
      return;
    }

    // Check for duplicate username
    const { data: usernameData, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', profile.username);

    if (usernameData && usernameData.length > 0) {
      setProfileError('Username already taken. Please choose another.');
      setLoading(false);
      return;
    }

    // Save profile info (update if exists, insert if not)
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        name: profile.name,
        contact: profile.contact,
        username: profile.username,
        user_id: user?.id || null,
      });

    setLoading(false);

    if (upsertError) {
      setProfileError(upsertError.message);
    } else {
      setShowProfileModal(false);
      // Optionally, update user context/state here
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else if (data.user) {
      const mappedUser: UserProfile = {
        id: data.user.id,
        email: data.user.email ?? '',
        avatar_url: data.user.user_metadata?.avatar_url ?? undefined,
      };
      onAuth(mappedUser);
      setShowSignIn(false);
    }
  };

  return (
    <div>
      <>
        {/* Existing Sign In Modal */}
        <Modal show={showSignIn} onHide={() => setShowSignIn(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
              {resetSent && <Alert variant="info" className="mt-2">Password reset email sent!</Alert>}
              <Button variant="primary" className="mt-2 me-2" onClick={handleSignIn} disabled={loading}>Sign In</Button>
              <Button variant="outline-info" className="mt-2 me-2" onClick={handlePasswordReset} disabled={loading || !email}>Reset Password</Button>
              <Button variant="outline-dark" className="mt-2" onClick={handleGoogleLogin} disabled={loading}>Sign in with Google</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Existing Sign Up Modal */}
        <Modal show={showSignUp} onHide={() => setShowSignUp(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="profileName">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={profile.name} onChange={handleProfileChange} />
              </Form.Group>
              <Form.Group controlId="profileContact">
                <Form.Label>Contact Info</Form.Label>
                <Form.Control name="contact" value={profile.contact} onChange={handleProfileChange} />
              </Form.Group>
              <Form.Group controlId="profileUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" value={profile.username} onChange={handleProfileChange} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              {profileError && <Alert variant="danger" className="mt-2">{profileError}</Alert>}
              <Button variant="primary" onClick={handleSignUp} disabled={loading}>Sign Up</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Profile Modal: showProfileModal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Complete Your Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="profileNameModal">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Form.Group controlId="profileContactModal">
                <Form.Label>Contact Info</Form.Label>
                <Form.Control
                  name="contact"
                  value={profile.contact}
                  onChange={handleProfileChange}
                  placeholder="Enter your contact info"
                />
              </Form.Group>
              <Form.Group controlId="profileUsernameModal">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  placeholder="Choose a username"
                />
              </Form.Group>
              {profileError && <Alert variant="danger" className="mt-2">{profileError}</Alert>}
              <Button
                variant="primary"
                onClick={handleProfileSave}
                disabled={loading}
                className="mt-2"
              >
                Save Profile
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Verification Alert */}
        {verifySent && (
          <Alert variant="info">
            Account created! Please check your email and verify your address before signing in.
          </Alert>
        )}

        {/* User Avatar */}
        {user && user.avatar_url && (
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <Image src={user.avatar_url} roundedCircle width={40} height={40} alt="avatar" />
          </div>
        )}
      </>
    </div>
  );
};

export default Auth;
