'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Loading from '../../../components/ReusableComponents/Loading';
import dynamic from 'next/dynamic';
import ItemSmallItem from '../../../components/ReusableComponents/ItemSmallItem';
import {
  FaTag,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaHeart,
  FaShareAlt,
  FaCalendarAlt,
  FaBuilding,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Buttons/Button';
import BackButton from '../../../components/Buttons/BackButton';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCommerce } from '@/features/cart/commerce-context';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import demoProducts from '../../../lib/demoProducts';

const ImageSlider = dynamic(
  () => import('../../../components/photos/imageSlider'),
  {
    loading: () => <Loading myMessage="جاري التحميل..." />,
    ssr: false,
  },
);

const SyriaMap = dynamic(() => import('../../../components/map/SyriaMap'), {
  loading: () => <Loading myMessage="جاري تحميل الخريطة..." />,
  ssr: false,
});

const UserNameAndPhoto = dynamic(
  () => import('../../../components/ReusableComponents/userNameAndPhoto'),
  {
    loading: () => (
      <div className="w-10 h-10 bg-neutral-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  },
);

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);
  const [categoryFields, setCategoryFields] = useState([]);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { addToCart, favoriteItems, toggleFavorite } = useCommerce();
  const session = useSession();
  const userId = session?.data?.user?.id;

  useEffect(() => {
    if (post?.isDemo) {
      setIsLiked(favoriteItems.some((item) => item.id === post.id));
    }
  }, [post, favoriteItems]);

  useEffect(() => {
    if (!post || post.isDemo) return undefined;
    if (!userId) {
      setIsLiked(false);
      return undefined;
    }

    const controller = new AbortController();
    const loadFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `/api/favorite/ids?userId=${encodeURIComponent(userId)}`,
          { signal: controller.signal, headers: { Accept: 'application/json' } },
        );
        if (!response.ok) return;
        const payload = await response.json();
        const productIds = Array.isArray(payload?.productIds) ? payload.productIds : [];
        setIsLiked(productIds.includes(post.id));
      } catch (favoriteError) {
        if (favoriteError?.name !== 'AbortError') {
          console.error('Unable to load product favorite status:', favoriteError);
        }
      }
    };

    loadFavoriteStatus();
    return () => controller.abort();
  }, [post?.id, post?.isDemo, userId]);

  useEffect(() => {
    setIsClient(true);
    const controller = new AbortController();

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      // Demo items are intentionally local-only. Real product pages must work
      // on direct links and fresh browser sessions without relying on localStorage.
      const demoProduct = demoProducts.find((product) => product.id === id);
      if (demoProduct) {
        setPost(demoProduct);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/showPostById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ id }),
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data || data.id !== id) {
          throw new Error('لم يتم العثور على الإعلان');
        }

        setPost(data);
      } catch (loadError) {
        if (loadError?.name === 'AbortError') return;

        // Fall back to a matching cached item only if the API is unavailable.
        try {
          const itemData = localStorage.getItem('item');
          const storedItem = itemData ? JSON.parse(itemData) : null;
          if (storedItem?.id === id && !storedItem?.isDemo) {
            setPost(storedItem);
          } else {
            setError(loadError?.message || 'تعذر تحميل الإعلان');
          }
        } catch {
          setError('تعذر تحميل الإعلان');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (isClient && post?.categoryName) {
      import(`../../../components/categoryFields/${post.categoryName}.jsx`)
        .then((module) => setCategoryFields(module.default))
        .catch(() => setError('فشل في تحميل الحقول'));
    }
  }, [isClient, post?.categoryName]);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (isClient && post?.link) {
        const embedUrl = await getEmbedUrl(post.link);
        setIframeSrc(embedUrl);
      }
    };
    fetchEmbedUrl();
  }, [isClient, post?.link]);

  const getFieldValue = (field, value) =>
    field.options && field.options[value] ? field.options[value] : value;

  const commonFields = useMemo(() => {
    if (!isClient || !post) return [];
    return [
      { name: 'العنوان', icon: <FaTag className="text-orange-500" />, value: post.title },
      { name: 'تاريخ النشر', icon: <FaClock className="text-amber-500" />, value: post.createdAt },
      { name: 'السعر', icon: <FaDollarSign className="text-yellow-500" />, value: post.basePrice },
      { name: 'المدينة', icon: <FaMapMarkerAlt className="text-red-500" />, value: post.city },
      { name: 'المنطقة', icon: <FaMapMarkerAlt className="text-orange-600" />, value: post.town },
      { name: 'الهاتف', icon: <FaPhone className="text-emerald-500" />, value: post.phoneNumber },
    ];
  }, [isClient, post]);

  const fields = useMemo(() => [...commonFields, ...categoryFields], [commonFields, categoryFields]);

  const getEmbedUrl = async (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (videoId?.[1]) {
        const embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
        return (await checkUrl(embedUrl)) ? embedUrl : null;
      }
    }
    if (url.includes('tiktok.com')) {
      const videoId = url.match(/\/video\/(\d+)/);
      if (videoId?.[1]) return `https://www.tiktok.com/embed/${videoId[1]}`;
    }
    return null;
  };

  const checkUrl = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleLike = async () => {
    if (!post?.id) return;

    if (post.isDemo) {
      toggleFavorite(post);
      return;
    }

    if (!userId) {
      toast.error('سجّل الدخول لإضافة المنتج إلى المفضلة');
      return;
    }

    const previousState = isLiked;
    setIsLiked(!previousState);
    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: post.id, userId }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'تعذر تحديث المفضلة');
      setIsLiked(Boolean(payload?.favorited));
      toast.success(payload?.message || 'تم تحديث المفضلة');
    } catch (favoriteError) {
      setIsLiked(previousState);
      toast.error(favoriteError?.message || 'تعذر تحديث المفضلة');
    }
  };

  const handleAddToCart = () => {
    try {
      addToCart(post);
      toast.success('تمت إضافة المنتج إلى السلة');
    } catch (addError) {
      toast.error(addError.message);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, text: post?.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loading myMessage="جاري التحميل..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/20 to-neutral-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-900/80 backdrop-blur-xl border border-orange-500/20 p-8 rounded-3xl text-center max-w-md w-full shadow-2xl"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">حدث خطأ</h2>
          <p className="text-neutral-400 mb-6">{error || 'لم يتم العثور على الإعلان'}</p>
          <Button
            title="العودة للرئيسية"
            path="/"
            style="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-600/20"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-orange-950/10 to-neutral-950 relative overflow-hidden " dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Vertical Text Decoration */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 -z-10 hidden xl:block">
        <h1 className="text-[12rem] font-black text-neutral-800/30 writing-vertical-rl tracking-tighter select-none">
          DETAILS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex items-center gap-3">
              <BackButton />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="p-3 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 rounded-2xl transition-all text-neutral-300 hover:text-white backdrop-blur-xl"
                >
                  {copied ? <FiCheck className="text-emerald-500" /> : <FaShareAlt className="text-lg" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`p-3 rounded-2xl border backdrop-blur-xl transition-all ${
                    isLiked
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-red-400'
                  }`}
                >
                  <FaHeart className="text-lg" />
                </motion.button>
              </div>
            </div>

            {/* Price Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="relative bg-gradient-to-br from-orange-600 to-amber-600 px-8 py-5 rounded-3xl shadow-2xl shadow-orange-600/30 border border-orange-500/30 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-8 h-8 bg-neutral-950/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 right-0 w-8 h-8 bg-neutral-950/20 rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <span className="text-sm text-orange-100 font-medium block mb-1">السعر</span>
                <span className="text-4xl font-black text-white tracking-tight">
                  {post.basePrice?.toLocaleString()}
                  <span className="text-lg font-bold mr-2">ل.س</span>
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl shadow-black/50"
            >
              {post?.image1 ? (
                <ImageSlider
                  image1={post.image1}
                  image2={post.image2}
                  image3={post.image3}
                  image4={post.image4}
                  image5={post.image5}
                />
              ) : (
                <div className="h-96 bg-neutral-900 flex items-center justify-center">
                  <Loading myMessage="لا توجد صور" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800 hover:border-orange-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt className="text-2xl text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-neutral-400 text-sm font-medium mb-1">الموقع</h3>
                    <p className="text-white font-bold text-lg">{post.city}</p>
                    {post.town && <p className="text-neutral-400 text-sm">{post.town}</p>}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaCalendarAlt className="text-2xl text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-neutral-400 text-sm font-medium mb-1">تاريخ النشر</h3>
                    <p className="text-white font-bold">{post.createdAt}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tabs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl border border-neutral-800 overflow-hidden"
            >
              <div className="flex border-b border-neutral-800 p-2 gap-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-3.5 px-6 font-bold text-sm rounded-2xl transition-all ${
                    activeTab === 'details'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  التفاصيل
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-3.5 px-6 font-bold text-sm rounded-2xl transition-all ${
                    activeTab === 'description'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                  }`}
                >
                  الوصف
                </button>
                {post?.lng && post?.lat && (
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex-1 py-3.5 px-6 font-bold text-sm rounded-2xl transition-all ${
                      activeTab === 'map'
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/20'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
                  >
                    الخريطة
                  </button>
                )}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field, index) => {
                      const value = post?.details?.[field?.name] || field?.value;
                      const displayValue = getFieldValue(field, value);
                      if (!displayValue) return null;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-4 hover:border-orange-500/30 hover:bg-neutral-800/80 transition-all group"
                        >
                          <ItemSmallItem icon={field?.icon} text={field?.label || field?.name} value={displayValue} />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'description' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-neutral-300 leading-relaxed text-lg">{post.description}</p>
                  </motion.div>
                )}

                {activeTab === 'map' && post?.lng && post?.lat && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden border border-neutral-700 h-96 relative">
                    <SyriaMap lng={post.lng} lat={post.lat} />
                    <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-neutral-700">
                      <p className="text-white font-bold text-sm">{post.city}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Video Section */}
            {post?.link && iframeSrc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl"
              >
                <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-500 text-lg">▶</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">فيديو توضيحي</h3>
                </div>
                <div className="aspect-video bg-black">
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full"
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Title Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-950 backdrop-blur-2xl rounded-3xl p-8 border border-neutral-800 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-orange-600/20 border border-orange-500/30 rounded-xl text-orange-400 text-xs font-bold">
                    {post.categoryName || 'إعلان'}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-6">
                  {post.title}
                </h1>

                <div className="space-y-4">
                  <UserNameAndPhoto post={post} size="size-12" rounded={true} />

                  {post?.phoneNumber && (
                    <a
                      href={`tel:${post.phoneNumber}`}
                      className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 group hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FaPhone className="group-hover:rotate-12 transition-transform" />
                      اتصل الآن
                    </a>
                  )}

                  {post?.isDemo && (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full rounded-2xl bg-neutral-800 hover:bg-neutral-700 px-6 py-4 font-bold text-white transition border border-neutral-700"
                    >
                      أضف إلى السلة
                    </button>
                  )}

                  <Button
                    title="العودة للرئيسية"
                    path="/"
                    style="w-full bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white font-bold py-4 px-6 rounded-2xl transition-all border border-neutral-700"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/50 backdrop-blur-xl rounded-3xl p-6 border border-neutral-800"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                معلومات سريعة
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-orange-500" />
                    المدينة
                  </span>
                  <span className="text-white font-bold">{post.city}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <FaBuilding className="text-amber-500" />
                    المنطقة
                  </span>
                  <span className="text-white font-bold">{post.town || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <FaClock className="text-emerald-500" />
                    التاريخ
                  </span>
                  <span className="text-white font-bold text-sm">{post.createdAt}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}