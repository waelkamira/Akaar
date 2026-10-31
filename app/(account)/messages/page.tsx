import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth/require-auth';
import MessagesInbox from './messages-inbox';

type Props = {
  searchParams: Promise<{ storeId?: string; conversation?: string }>;
};

export default async function MessagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await getAuthenticatedUser();
  const query = new URLSearchParams();
  if (params.storeId) query.set('storeId', params.storeId);
  if (params.conversation) query.set('conversation', params.conversation);
  if (!user) {
    const queryString = query.toString();
    const callbackUrl = `/messages${queryString ? `?${queryString}` : ''}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <MessagesInbox
      userId={user.id}
      initialStoreId={params.storeId?.slice(0, 128) || ''}
      initialConversationId={params.conversation?.slice(0, 128) || ''}
    />
  );
}
