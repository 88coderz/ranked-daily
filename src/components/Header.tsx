import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex justify-end p-4">
      <Link href="/login" className="btn btn-primary mr-2">Login</Link>
      <Link href="/signup" className="btn btn-secondary">Sign Up</Link>
    </header>
  );
}