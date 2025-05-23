import { NextResponse } from 'next/server';
import imgurClientManager from '../../../components/photos/ImgurClientManager';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  // Get the next available Client ID
  const clientId = imgurClientManager.getClientId();
  try {
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: file,
    });

    const data = await imgurResponse.json();

    if (imgurResponse.ok) {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, error: data.data.error },
        { status: imgurResponse.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
