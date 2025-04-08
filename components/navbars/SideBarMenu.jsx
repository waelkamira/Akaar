'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useRef } from 'react';
import Button from '../Buttons/Button'; // تأكد من أن المسار صحيح
import UserNameAndPhoto from '../ReusableComponents/userNameAndPhoto'; // تأكد من أن المسار صحيح
import categories from '../Categories/categories'; // تأكد من أن المسار صحيح
import mainButtons from '../lists/mainButtons'; // تأكد من أن المسار صحيح
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { TfiMenuAlt } from 'react-icons/tfi';
import { motion, AnimatePresence } from 'framer-motion';

// تعريف المتغيرات المتحركة لتحسين قابلية القراءة
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sidebarVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 120, damping: 20 },
  },
  exit: {
    x: '100%',
    transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SideBarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); // استخدم data و status مباشرةً
  const [user, setUser] = useState(null); // ابدأ بقيمة null
  const sidebarRef = useRef(null); // Ref للإشارة إلى عنصر القائمة

  // استرجاع بيانات المستخدم من localStorage (إذا لزم الأمر لمعلومات إضافية غير موجودة في الجلسة)
  useEffect(() => {
    // التحقق من أننا في بيئة المتصفح فقط
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('CurrentUser');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        // قم بتحديث الحالة فقط إذا كانت البيانات مختلفة أو غير موجودة
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error(
          'خطأ في قراءة أو تحليل CurrentUser من localStorage:',
          error
        );
        // يمكن تعيين قيمة افتراضية أو مسح الخطأ إذا لزم الأمر
        localStorage.removeItem('CurrentUser');
        setUser(null);
      }
    }
    // يجب إضافة 'user' إلى قائمة التبعيات إذا كنت تريد إعادة تشغيل التأثير عند تغير 'user'
    // ولكن في هذه الحالة، نريد تشغيله مرة واحدة عند التحميل وربما عند تغير 'session'
  }, [status]); // أعد تشغيل التأثير عند تغير حالة الجلسة أيضًا للتأكد من المزامنة

  // دالة لتبديل حالة القائمة
  const toggleMenu = () => setIsOpen(!isOpen);

  // دالة لإغلاق القائمة
  const closeMenu = () => setIsOpen(false);

  // تأثير لإغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      // أغلق القائمة فقط إذا كانت مفتوحة والنقرة خارج عنصر القائمة
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    // إضافة المستمع عند فتح القائمة
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // إزالة المستمع عند إغلاق القائمة
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // تنظيف المستمع عند إلغاء تحميل المكون أو عند تغير حالة isOpen
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // تعتمد فقط على حالة isOpen

  return (
    <div className="xl:hidden relative">
      {/* زر فتح القائمة */}
      <button
        onClick={toggleMenu}
        aria-label="فتح القائمة" // لتحسين الوصولية
        className="p-2 text-3xl sm:text-4xl text-gray-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-md transition-colors duration-200 z-[1005]" // تعديل الحجم والتركيز
      >
        <TfiMenuAlt />
      </button>

      {/* القائمة الجانبية مع تأثيرات */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية شبه شفافة */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeMenu} // إغلاق عند النقر على الخلفية
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1999]" // زيادة التعتيم قليلاً وتأثير blur أوضح
              aria-hidden="true" // لإخفائها من قارئات الشاشة
            />

            {/* محتوى القائمة */}
            <motion.div
              ref={sidebarRef} // ربط الـ ref هنا
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-screen w-72 max-w-[85vw] bg-white shadow-xl z-[2000] flex flex-col overflow-y-auto" // استخدام لون خلفية صلب لتحسين القراءة
              role="dialog" // دور ARIA
              aria-modal="true" // يجعل العناصر الأخرى غير نشطة
              aria-labelledby="sidebar-title" // ربط بعنوان القائمة
            >
              {/* رأس القائمة (زر الإغلاق والعنوان) */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2
                  id="sidebar-title"
                  className="text-lg font-semibold text-gray-800"
                >
                  القائمة
                </h2>
                <button
                  onClick={closeMenu}
                  aria-label="إغلاق القائمة"
                  className="text-3xl text-gray-500 hover:text-red-600 transition-colors duration-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <IoCloseOutline />
                </button>
              </div>

              {/* محتوى القائمة القابل للتمرير */}
              <div className="flex-grow p-6 flex flex-col gap-6">
                {/* قسم المستخدم */}
                <div className="flex flex-col items-center gap-4">
                  {status === 'loading' && (
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="rounded-full bg-gray-300 h-20 w-20"></div>
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                  )}
                  {status === 'authenticated' && session.user && (
                    <Link href="/profile" passHref legacyBehavior>
                      <a
                        onClick={closeMenu}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                      >
                        <UserNameAndPhoto size={'size-20'} />
                      </a>
                    </Link>
                  )}
                  {status === 'unauthenticated' && (
                    <Button
                      title={'تسجيل الدخول'}
                      path={'/login'}
                      onClick={closeMenu}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                    />
                  )}
                  {status === 'authenticated' && user?.isAdmin === 1 && (
                    <Button
                      path={'/dashboard/users'} // مسار أكثر تحديدًا
                      title={'لوحة التحكم'} // عنوان أكثر وضوحًا
                      onClick={closeMenu}
                      className="w-full bg-secondary-500 hover:bg-secondary-600 text-white"
                    />
                  )}
                </div>

                {/* فاصل بصري */}
                <hr className="border-gray-200" />

                {/* الأزرار الرئيسية للمستخدم المسجل دخوله */}
                {status === 'authenticated' && (
                  <nav aria-label="القائمة الرئيسية">
                    <ul className="flex flex-col gap-2">
                      {mainButtons?.map((button, index) => (
                        <motion.li
                          key={button.title}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <Button
                            title={button.title}
                            path={button.path}
                            emoji={button.emoji}
                            onClick={closeMenu}
                            className="w-full justify-start text-left px-4 py-3 h-auto text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-primary-600" // تصميم هادئ
                          />
                        </motion.li>
                      ))}
                    </ul>
                  </nav>
                )}

                {/* قسم الفئات */}
                {categories && categories.length > 0 && (
                  <>
                    {/* فاصل بصري إذا كانت الأزرار الرئيسية موجودة */}
                    {status === 'authenticated' && (
                      <hr className="border-gray-200" />
                    )}

                    <div className="flex flex-col gap-3">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">
                        الفئات
                      </h3>
                      <nav aria-label="الفئات">
                        <ul className="flex flex-col gap-2">
                          {categories.map((category, index) => (
                            <motion.li
                              key={category.id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{
                                delay:
                                  (mainButtons?.length || 0 + index) * 0.05,
                                duration: 0.3,
                              }} // تأخير يبدأ بعد الأزرار الرئيسية
                            >
                              <Link
                                href={category.path}
                                passHref
                                legacyBehavior
                              >
                                <a
                                  onClick={closeMenu}
                                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 hover:text-primary-700 focus:bg-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-colors duration-200 group" // تحسين التفاعل والحالة النشطة
                                >
                                  {category.icon && (
                                    <span className="text-xl text-primary-500 group-hover:text-primary-600">
                                      {category.icon}
                                    </span>
                                  )}
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                                    {category.name}
                                  </span>
                                </a>
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </>
                )}

                {/* زر إغلاق إضافي في الأسفل (اختياري، يمكن الاعتماد على زر الإغلاق في الرأس والنقر الخارجي) */}

                <div className="mt-auto pt-4">
                  {' '}
                  <Button
                    title={'إغلاق'}
                    onClick={closeMenu}
                    emoji={<IoCloseOutline className="text-xl" />} // حجم الأيقونة
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
