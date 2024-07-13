import NavLinks from './navLinks';

/**
 * Component for the side navigation, which includes navigation links.
 *
 * @returns {JSX.Element} The SideNav component.
 */
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
