'use client';
import Item from '../../components/Item';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from '../../components/Context';

export default function Page() {
  const [onePost, setOnePost] = useState({});
  const { id } = useParams();
  const { postId } = useContext(inputsContext);

  useEffect(() => {
    console.log('postId', postId);
    fetchOnePost(postId);
  }, []);
  async function fetchOnePost(postId) {
    // console.log('id', id);
    const response = await fetch(`/api/showPostById?id=${postId}`);
    const json = await response?.json();
    if (response.ok) {
      console.log('json', json);
      setOnePost(json);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full bg-gradient-to-r from-[#494949] to-four">
      {onePost && <Item {...onePost} />}
    </div>
  );
}
