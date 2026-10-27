'use client';
import toast from 'react-hot-toast';
import { inputsContext } from '@/features/auth/inputs-context';
import { useContext } from 'react';
import CustomToast from './CustomToast';

export default function DeletePostHandler({ recipe }) {
  const { dispatch } = useContext(inputsContext);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(recipe?.id || '')}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            message={'تم حذف هذا البوست بنجاح'}
            greenEmoji={'✔'}
          />
        ));
        dispatch({ type: 'DELETE_RECIPE', payload: recipe });
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'😐 حدث خطأ ما '} redEmoji={'✖'} />
        ));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return <button onClick={handleDelete}>حذف البوست</button>;
}
