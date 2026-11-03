import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import { listUserNotifications, markUserNotificationsRead } from '@/lib/notifications/repository';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect('/login?callbackUrl=%2Fnotifications');

  const notifications = await listUserNotifications(user.id);
  if (notifications.some((notification) => !notification.isRead)) {
    await markUserNotificationsRead(user.id);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-ak-canvas px-4 py-8 text-ak-cream sm:py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="ak-panel-raised rounded-3xl p-6 sm:p-8">
          <p className="ak-eyebrow">ACCOUNT UPDATES</p>
          <h1 className="mt-2 text-3xl font-black">إشعاراتي</h1>
          <p className="mt-2 text-sm text-ak-muted">تنبيهات الحساب وتحديثات المتجر. <Link href="/messages" className="text-ak-honey underline">افتح محادثات المتجر</Link></p>
        </header>
        <section aria-label="قائمة الإشعارات" className="space-y-3">
          {notifications.map((notification) => (
            <article key={notification.id} className={`rounded-2xl border p-5 ${notification.isRead ? 'border-ak-line bg-ak-surface' : 'border-sky-400/30 bg-sky-400/10'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${notification.type === 'STORE_APPROVED' ? 'bg-emerald-400/15 text-emerald-200' : notification.type === 'STORE_REJECTED' ? 'bg-rose-400/15 text-rose-200' : 'bg-sky-400/15 text-sky-200'}`}>
                  {notification.type === 'STORE_APPROVED' ? 'تمت الموافقة على المتجر' : notification.type === 'STORE_REJECTED' ? 'تحديث طلب المتجر' : 'إشعار'}
                </span>
                <time dateTime={notification.createdAt.toISOString()} className="text-xs text-stone-400">
                  {new Intl.DateTimeFormat('ar', { dateStyle: 'medium', timeStyle: 'short' }).format(notification.createdAt)}
                </time>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ak-cream">{notification.message}</p>
              {notification.type === 'STORE_MESSAGE' && <Link href="/messages" className="mt-3 inline-block text-xs font-semibold text-ak-honey underline">عرض الرسائل</Link>}
              {!notification.isRead && <span className="mt-3 inline-block text-xs font-semibold text-sky-200">جديد</span>}
            </article>
          ))}
          {!notifications.length && <p className="rounded-2xl border border-ak-line bg-ak-surface p-8 text-center text-sm text-ak-muted">لا توجد إشعارات حتى الآن.</p>}
        </section>
      </div>
    </main>
  );
}
