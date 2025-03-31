'use client';
import { FaCanadianMapleLeaf, FaHome } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { FcConferenceCall } from 'react-icons/fc';
import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineMapsHomeWork } from 'react-icons/md';
import { IoIosContacts } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';

const mainButtons = [
  {
    title: 'الرئيسية',
    path: '/',
    emoji: <FaHome />,
  },
  {
    title: 'بروفايل',
    path: '/profile',
    emoji: <ImProfile />,
  },
  {
    title: 'متجري',
    path: '/myPosts',
    emoji: <FaCanadianMapleLeaf />,
  },
  {
    title: 'المفضلة',
    path: '/favorite',
    emoji: <TbTargetArrow />,
  },
  {
    title: 'إنشاء إعلان',
    path: '/newPost',
    emoji: <MdOutlineMapsHomeWork />,
  },
  {
    title: 'اتصل بنا',
    path: '/contactUs',
    emoji: <IoIosContacts />,
  },
];

export default mainButtons;
