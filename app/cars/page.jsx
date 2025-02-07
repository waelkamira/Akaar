'use client';
import CarsSearchBar from '../../components/Cars/CarsSearchBar';
export default function Cars() {
  return (
    <div className="flex flex-col items-center w-full">
      <CarsSearchBar propertyCategory="سيارات" />
    </div>
  );
}
