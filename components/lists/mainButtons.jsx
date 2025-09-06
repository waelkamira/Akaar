'use client';
import { FaCanadianMapleLeaf, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineMapsHomeWork } from 'react-icons/md';
import { IoIosContacts } from 'react-icons/io';

const mainButtons = [
  {
    title: 'الرئيسية',
    path: '/',
    icon: <FaHome />,
  },
  {
    title: 'بروفايل',
    path: '/profile',
    icon: <ImProfile />,
  },
  {
    title: 'متجري',
    path: '/myPosts',
    icon: <FaCanadianMapleLeaf />,
  },
  {
    title: 'المفضلة',
    path: '/favorite',
    icon: <TbTargetArrow />,
  },
  {
    title: 'إنشاء إعلان',
    path: '/newPost',
    icon: <MdOutlineMapsHomeWork />,
  },
  {
    title: 'اتصل بنا',
    path: '/contactUs',
    icon: <IoIosContacts />,
  },
];

export default mainButtons;
