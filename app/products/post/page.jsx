'use client';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../../components/authContext/Context';
import CarsSideBar from '../../../components/Cars/CarsSideBar';
import CarsNavbar from '../../../components/Cars/CarsNavbar';

// تحميل مكون Item بشكل ديناميكي
const CarsItem = dynamic(() => import('../../../components/Cars/CarsItem'), {
  loading: () => <div>Loading...</div>, // عرض رسالة تحميل أثناء تحميل المكون
});

export default function Page() {
  const [post, setPost] = useState({});
  const { postId } = useContext(inputsContext);

  useEffect(() => {
    if (typeof window !== 'undefined' && postId) {
      localStorage.setItem('postId', JSON.stringify(postId));
    }
    if (typeof window !== 'undefined') {
      const id = JSON.parse(localStorage.getItem('postId'));
      // console.log('id', id);
      if (id) fetchPost(id);
    }
  }, [postId]);
  console.log('post', post);

  async function fetchPost(id) {
    const response = await fetch(`/api/Cars/showPostById`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    });
    const json = await response?.json();
    if (response.ok) {
      setPost(json);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full bg-five">
      <CarsNavbar />
      <CarsSideBar /> {post && <CarsItem {...post} />}
    </div>
  );
}
