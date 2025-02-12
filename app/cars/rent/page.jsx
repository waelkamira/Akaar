'use client';
import CarsSearchBar from '../../../components/Cars/CarsSearchBar';
export default function Buy() {
  return (
    <div className="flex flex-col items-center w-full rounded-b z-0 bg-five">
      <CarsSearchBar
        category="أجار"
        imgLink={'https://i.imgur.com/yH5NGMz.jpg'}
      />
    </div>
  );
}
