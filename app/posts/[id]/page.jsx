'use client';
import Item from '../../../components/Item';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [onePost, setOnePost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetchOnePost();
  }, []);
  async function fetchOnePost() {
    console.log('id', id);
    const response = await fetch(`/api/showPostById?id=${id}`);
    const json = await response?.json();
    if (response.ok) {
      console.log('json', json);
      setOnePost(json);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Item {...onePost} />
    </div>
  );
}
