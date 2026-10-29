import React, { useState, useEffect } from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { FaRegHeart } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const favoriteCacheDuration = 30_000;
const favoriteIdsCache = new Map();
const favoriteIdsRequests = new Map();
const favoriteUpdateEvent = 'marketplace:favorite-updated';

function getFavoriteIds(userId) {
  const cached = favoriteIdsCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.ids);

  const pendingRequest = favoriteIdsRequests.get(userId);
  if (pendingRequest) return pendingRequest;

  const request = fetch(`/api/favorite/ids?userId=${encodeURIComponent(userId)}`, {
    headers: { Accept: 'application/json' },
  })
    .then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'تعذر تحميل حالة المفضلة.');
      const ids = Array.isArray(result?.productIds) ? result.productIds : [];
      favoriteIdsCache.set(userId, { ids, expiresAt: Date.now() + favoriteCacheDuration });
      return ids;
    })
    .finally(() => favoriteIdsRequests.delete(userId));

  favoriteIdsRequests.set(userId, request);
  return request;
}

function FavoriteButton({ item }) {
  const [favoriteStatus, setFavoriteStatus] = useState(null);
  const [loadedFavoriteKey, setLoadedFavoriteKey] = useState(null);
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isSaving, setIsSaving] = useState(false);
  const favoriteKey = JSON.stringify([userId, item?.id]);
  const isLoading = Boolean(userId) && loadedFavoriteKey !== favoriteKey;
  const isFavorited = favoriteStatus?.userId === userId
    && favoriteStatus?.productId === item?.id
    && favoriteStatus.favorited;

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    let active = true;
    const handleFavoriteUpdate = (event) => {
      const detail = event.detail;
      if (detail?.userId === userId && detail.productId === item?.id) {
        setFavoriteStatus({
          userId,
          productId: item?.id,
          favorited: detail.favorited,
        });
        setLoadedFavoriteKey(favoriteKey);
      }
    };

    window.addEventListener(favoriteUpdateEvent, handleFavoriteUpdate);
    getFavoriteIds(userId)
      .then((ids) => {
        if (active) {
          setFavoriteStatus({
            userId,
            productId: item?.id,
            favorited: ids.includes(item?.id),
          });
          setLoadedFavoriteKey(favoriteKey);
        }
      })
      .catch((error) => {
        if (active) {
          console.error('Unable to load favorite status:', error);
          toast.error('تعذر تحميل حالة المفضلة.');
          setLoadedFavoriteKey(favoriteKey);
        }
      });

    return () => {
      active = false;
      window.removeEventListener(favoriteUpdateEvent, handleFavoriteUpdate);
    };
  }, [favoriteKey, item?.id, userId]);

  const handleFavorite = async () => {
    if (!item?.id) return;
    if (!userId) {
      toast.error('سجّل الدخول لإضافة المنتج إلى المفضلة');
      return;
    }
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, userId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'تعذر تحديث المفضلة.');
      const favorited = Boolean(data?.favorited);
      setFavoriteStatus({ userId, productId: item.id, favorited });
      const cached = favoriteIdsCache.get(userId);
      if (cached) {
        const ids = new Set(cached.ids);
        if (favorited) ids.add(item.id);
        else ids.delete(item.id);
        favoriteIdsCache.set(userId, {
          ids: [...ids],
          expiresAt: Date.now() + favoriteCacheDuration,
        });
      }
      window.dispatchEvent(new CustomEvent(favoriteUpdateEvent, {
        detail: { userId, productId: item.id, favorited },
      }));
      toast.success(data?.message || 'تم تحديث المفضلة');
    } catch (error) {
      console.error('Error handling favorite:', error);
      toast.error(error instanceof Error ? error.message : 'تعذر تحديث المفضلة.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      type="button"
      aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
      aria-pressed={isFavorited}
      disabled={isLoading || isSaving}
      className="absolute top-0 left-2 z-10 flex size-10 items-center justify-center p-2"
      onClick={(event) => {
        event.stopPropagation();
        void handleFavorite();
      }}
    >
      <span className="flex size-8 items-center justify-center rounded-full p-2 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
        {isFavorited ? (
          <TbHeartFilled className="size-4 text-red-600 transition-colors duration-300" />
        ) : (
          <FaRegHeart className="size-4 bg-transparent text-clip text-white transition-colors duration-300 hover:text-red-500" />
        )}
      </span>
    </button>
  );
}

export default FavoriteButton;
