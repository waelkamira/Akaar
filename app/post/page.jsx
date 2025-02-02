'use client';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/Context';

// تحميل مكون Item بشكل ديناميكي
const Item = dynamic(() => import('../../components/Item'), {
  loading: () => <div>Loading...</div>, // عرض رسالة تحميل أثناء تحميل المكون
});

export default function Page() {
  const [onePost, setOnePost] = useState({});
  const { postId } = useContext(inputsContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Run only in the client environment
      console.log('postId', postId);
      if (postId) fetchOnePost(postId);
    }
  }, [postId]);

  async function fetchOnePost(postId) {
    const response = await fetch(`/api/showPostById`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId }),
    });
    const json = await response?.json();
    if (response.ok) {
      setOnePost(json);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gradient-to-r from-[#494949] to-four">
      {onePost && <Item {...onePost} />}
    </div>
  );
}
