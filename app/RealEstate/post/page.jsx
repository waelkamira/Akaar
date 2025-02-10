'use client';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../../components/Context';

// تحميل مكون Item بشكل ديناميكي
const RealEstateItem = dynamic(
  () => import('../../../components/RealEstate/RealEstateItem'),
  {
    loading: () => <div>Loading...</div>, // عرض رسالة تحميل أثناء تحميل المكون
  }
);

export default function Page() {
  const [post, setPost] = useState({});
  const { postId } = useContext(inputsContext);

  useEffect(() => {
    if (typeof window !== 'undefined' && postId) {
      localStorage.setItem('postId', JSON.stringify(postId));
    }
    if (typeof window !== 'undefined') {
      const id = JSON.parse(localStorage.getItem('postId'));
      console.log('id', id);
      if (id) fetchPost(id);
    }
  }, [postId]);
  console.log('post', post);

  async function fetchPost(id) {
    const response = await fetch(`/api/RealEstate/showPostById`, {
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
    <div className="flex flex-col justify-center items-center w-full">
      {post && <RealEstateItem {...post} />}
    </div>
  );
}
