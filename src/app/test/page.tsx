import { notFound } from 'next/navigation';
import TestContent from './TestContent';

// This Server Component runs at build time.
// notFound() prevents the route from being generated in the production
// static export, so GitHub Pages users can never reach this page.
export default function TestPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }
  return <TestContent />;
}
