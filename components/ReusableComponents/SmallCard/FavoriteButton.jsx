// FavoriteButton.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { FaRegHeart } from 'react-icons/fa6';
import toast from 'react-hot-toast';

function FavoriteButton({ item }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      const favoriteIds = localStorage.getItem('favoriteIds');

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user?.id);
          setFavoriteIds(favoriteIds);
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }
  }, []);

  const fetchAndStoreUserFavoriteIds = useCallback(
    async (userId) => {
      // console.log('fetchAndStoreUserFavoriteIds من داخل ');

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
    [isFavorited]
  );

  const checkFavoriteStatus = useCallback(() => {
    // console.log('checkFavoriteStatus تم الاستدعاء ');

    if (item?.id) {
      const favorited = favoriteIds.includes(item?.id);
      // console.log('favoriteIds', favoriteIds);
      if (favorited) {
        // console.log('favorited', favorited);
        // console.log('item?.id', item?.id);
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
    if (!item?.id || !userId) return;
    console.log('item?.id', item?.id);

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
    <div
      className="absolute top-0 left-2 z-10 size-10 p-2"
      onClick={(e) => {
        e.stopPropagation();
        handleFavorite();
      }}
    >
      <div
        className={`bg-white/20 backdrop-blur-sm rounded-full size-8 p-2 shadow-sm shadow-gray-500 transition-all duration-300 hover:scale-110 cursor-pointer`}
      >
        {isFavorited ? (
          <TbHeartFilled className="size-4 text-red-600 transition-colors duration-300" />
        ) : (
          <FaRegHeart className="size-4 text-gray-600 hover:text-red-500 transition-colors duration-300" />
        )}
      </div>
    </div>
  );
}

export default FavoriteButton;
