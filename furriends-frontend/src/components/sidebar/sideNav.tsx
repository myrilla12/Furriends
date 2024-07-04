import NavLinks from './navLinks';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-col justify-start space-y-2">
        <NavLinks />
        <div className="flex-grow bg-slate-100 rounded-md"></div>
      </div>
    </div>
  );
}
