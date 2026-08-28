import { permanentRedirect } from 'next/navigation';

export default function LegacyComparePage() {
  permanentRedirect('/compare');
}
