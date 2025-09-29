'use client';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Nav, Navbar, Container } from 'react-bootstrap';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Navbar
      fixed="top"
      className={isScrolled ? 'navbar-hidden' : 'navbar-visible'}
      bg="light"
    >
      <Container>
        <Navbar.Brand as={Link} href="/">
          Logo
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user ? (
            <Nav.Link href="#">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} href="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} href="/signup">
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
