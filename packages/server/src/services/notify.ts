import { NOTIFY_SERVICE_URL, isDevelopment } from '../config/env.js';

type NotifyData = {
  [key: string]: string;
  user: string;
};

export async function notify(
  message: string,
  data: NotifyData = {} as NotifyData,
) {
  if (isDevelopment) {
    console.log('Notification:', message, data);
    return;
  }

  if (!NOTIFY_SERVICE_URL) {
    throw new Error('Notify service URL is not defined.');
  }

  const { ok } = await fetch(NOTIFY_SERVICE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      ...data,
    }),
  });

  if (!ok) {
    throw new Error('Failed to send notification');
  }
}
