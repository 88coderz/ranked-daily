'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button, Form } from 'react-bootstrap'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const handleSignUp = async () => {
    await supabase.auth.signUp({ email, password })
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({ email, password })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <Form.Control
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
      />
      <Form.Control
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2"
      />
      <div className="d-flex">
        <Button onClick={handleSignUp} className="me-2">Sign Up</Button>
        <Button onClick={handleSignIn} className="me-2">Sign In</Button>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
    </div>
  )
}
