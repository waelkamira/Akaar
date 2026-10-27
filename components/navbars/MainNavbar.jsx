'use client';

import FirstNavBar from './FirstNavBar';

// The site header is global. The homepage owns its own hero so inner routes
// do not inherit a large promotional carousel or duplicate navigation.
export default function MainNavbar() {
  return <FirstNavBar />;
}
