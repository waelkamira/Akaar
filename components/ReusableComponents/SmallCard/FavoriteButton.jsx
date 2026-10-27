// FavoriteButton.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { FaRegHeart } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

function FavoriteButton({ item }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const session = useSession();
  const userId = session?.data?.user?.id;
  const sessionStatus = session.status;
  const [favoriteIds, setFavoriteIds] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedFavoriteIds = localStorage.getItem('favoriteIds');
      const parsedFavoriteIds = storedFavoriteIds ? JSON.parse(storedFavoriteIds) : [];
      setFavoriteIds(Array.isArray(parsedFavoriteIds) ? parsedFavoriteIds : []);
    } catch {
      localStorage.removeItem('favoriteIds');
      setFavoriteIds([]);
    }
  }, []);

  const fetchAndStoreUserFavoriteIds = useCallback(
    async (userId) => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/favorite/ids?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const productIds = json?.productIds || [];
        if (typeof window !== 'undefined') {
          localStorage.setItem('favoriteIds', JSON.stringify(productIds));
          setFavoriteIds(productIds);
        }
      } catch (error) {
        console.error('Failed to fetch or store favorites data:', error);
        toast.error('فشل في جلب بيانات المفضلة');
      }
    },
    []
  );

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (!userId) {
      setFavoriteIds([]);
      setIsFavorited(false);
      if (typeof window !== 'undefined') localStorage.removeItem('favoriteIds');
      return;
    }
    fetchAndStoreUserFavoriteIds(userId);
  }, [userId, sessionStatus, fetchAndStoreUserFavoriteIds]);

  const checkFavoriteStatus = useCallback(() => {
    if (item?.id) {
      const favorited = favoriteIds.includes(item?.id);
      if (favorited) {
        setIsFavorited(true);
      } else {
        setIsFavorited(false);
      }
    }
  }, [item?.id, favoriteIds]);

  useEffect(() => {
    if (isMounted.current) {
      checkFavoriteStatus();
    } else {
      isMounted.current = true;
    }
  }, [checkFavoriteStatus]);

  const handleFavorite = useCallback(async () => {
    if (!item?.id) return;
    if (!userId) {
      toast.error('سجّل الدخول لإضافة المنتج إلى المفضلة');
      return;
    }

    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsFavorited(data?.favorited);
        fetchAndStoreUserFavoriteIds(userId);
        toast.success(data?.message);
      } else {
        toast.error('حدث خطأ أثناء إضافته إلى المفضلة');
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      toast.error('حدث خطأ أثناء إضافته إلى المفضلة');
    }
  }, [item?.id, userId, fetchAndStoreUserFavoriteIds]);

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      aria-pressed={isFavorited}
      className="absolute top-0 left-2 z-10 flex size-10 items-center justify-center p-2"
      onClick={(event) => {
        event.stopPropagation();
        handleFavorite();
      }}
    >
      <span className="flex size-8 items-center justify-center rounded-full p-2 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
        {isFavorited ? (
          <TbHeartFilled className="size-4 text-red-600 transition-colors duration-300" />
        ) : (
          <FaRegHeart className="size-4 bg-transparent text-clip text-gray-600 transition-colors duration-300 hover:text-red-500" />
        )}
      </span>
    </button>
  );
}

export default FavoriteButton;
