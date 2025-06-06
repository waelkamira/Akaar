'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { IoMdClose, IoIosSearch } from 'react-icons/io';
import toast from 'react-hot-toast';
import CustomToast from '../../components/ReusableComponents/CustomToast';
import BackButton from '../../components/Buttons/BackButton';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import SideBarMenu from '../../components/navbars/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import Loading from '../../components/ReusableComponents/Loading';
import NavegationPages from '../../components/ReusableComponents/NavegationPages';

export default function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [users, setUsers] = useState([]);
  const [findUser, setFindUser] = useState('');
  const [user, setUser] = useState('');
  const session = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        const user = storedUser ? JSON.parse(storedUser) : null;
        setUser(user);
      } catch (error) {
        console.error('Error parsing CurrentUser from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (!session?.status === 'authenticated' || !user?.isAdmin) {
    return null;
  }

  async function fetchAllUsers() {
    const response = await fetch(
      `/api/allUsers?pageNumber=${pageNumber}&searchQuery=${findUser}&limit=5&isAdmin=true`
    );
    const json = await response.json();
    if (response.ok) {
      setUsers(json);
    }
  }

  async function handleDeleteUser(user) {
    if (user.isAdmin === true) {
      return toast.custom((t) => (
        <CustomToast t={t} message={'لايمكن حذف الأدمن ✖'} />
      ));
    }
    const response = await fetch('/api/user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast t={t} message={'تم حذف هذا المستخدم بنجاح ✔'} />
      ));
      fetchAllUsers();
    } else {
      toast.custom((t) => <CustomToast t={t} message={'😐 حدث خطأ ما ✖'} />);
    }
  }

  const handleSearch = () => {
    setPageNumber(1);
    fetchAllUsers();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center w-full bg-gray-800  text-lg ">
      <BackButton />
      <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4">
        <TfiMenuAlt
          className="p-1  text-4xl lg:text-5xl text-primary-500 cursor-pointer z-50 "
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div className="flex gap-4 justify-center items-center bg-gray-700  text-lg  w-full p-4 mt-16 xl:mt-24 shadow-sm shadow-gray-300 ">
        <input
          value={findUser}
          onChange={(e) => setFindUser(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          id="user"
          name="user"
          placeholder="ابحث عن اسم مستخدم ..."
          autoFocus
          className="text-right w-full p-2  text-lg outline-none focus:outline-primary-500 h-10 "
        />
        <button
          onClick={handleSearch}
          className="flex items-center justify-center p-2  bg-primary-500 "
        >
          <IoIosSearch className="text-2xl" />
        </button>
      </div>
      <div className="relative flex justify-between items-center p-4 sm:p-8 w-full">
        <h1>جميع المستخدمين :</h1>
      </div>
      <div className="flex flex-col justify-start items-center w-full">
        {users.length === 0 && <Loading />}
        <div className="w-full xl:w-1/2 flex flex-col gap-2 justify-center items-start p-4 sm:p-8">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                className="flex justify-between items-center bg-gray-700 my-2  w-full h-24 border-[3px] border-primary-500 p-2  shadow-sm shadow-gray-300 hover:shadow-sm shadow-gray-300  transition-shadow duration-300"
                key={index}
              >
                <div>
                  <h1 className="text-sm sm:text-md lg:text-lg">
                    اسم المستخدم: {user.name}
                  </h1>
                  <h1 className="text-sm sm:text-md lg:text-lg">
                    الايميل: {user.email}
                  </h1>
                </div>
                {user.isAdmin ? (
                  'أدمن'
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer bg-red-600  p-2 md:text-2xl  hover:bg-red-700"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <IoMdClose />
                    <h6 className="text-sm select-none">حذف</h6>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="">لا توجد نتائج مطابقة للبحث.</div>
          )}
        </div>
        {/* <div className="flex items-center justify-around my-4 mt-8 ">
          {users.length >= 5 && (
            <Link href="#post1">
              <div
                className="flex items-center justify-around cursor-pointer"
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                <h1 className=" ">الصفحة التالية</h1>
                <MdKeyboardDoubleArrowRight className="text-2xl  text-primary-500 select-none" />
              </div>
            </Link>
          )}
          {pageNumber > 1 && (
            <Link href="#post1">
              <div
                className="flex items-center justify-around cursor-pointer"
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <MdKeyboardDoubleArrowLeft className="text-2xl  text-primary-500 select-none" />
                <h1 className=" ">الصفحة السابقة</h1>
              </div>
            </Link>
          )}
        </div> */}
        <NavegationPages
          array={users}
          setPageNumber={setPageNumber}
          pageNumber={pageNumber}
        />
      </div>
    </div>
  );
}
