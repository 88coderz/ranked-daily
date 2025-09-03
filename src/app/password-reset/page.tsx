import { Metadata } from 'next';
import PasswordResetClient from './PasswordResetClient';

export const metadata: Metadata = {
  title: 'Password Reset - Ranked Daily',
  description: 'Reset your password for Ranked Daily.',
};

export default function PasswordReset() {
  return <PasswordResetClient />;
}
