import Link from 'next/link';
import NavLinks from './navLinks';
import SignoutButton from '@/components/signoutButton';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-col justify-start space-y-2">
        <NavLinks />
        <div className="flex-grow bg-slate-100 rounded-md"></div>
        <SignoutButton />
      </div>
    </div>
  );
}
