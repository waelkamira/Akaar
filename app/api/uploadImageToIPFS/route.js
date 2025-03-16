import axios from 'axios';

export const runtime = 'nodejs'; // تصحيح Next.js 14
export const maxDuration = 60; // تحديد مدة التنفيذ القصوى
export const dynamic = 'force-dynamic'; // جعل الـ API ديناميكيًا دائمًا

export async function POST(req) {
  try {
    const chunks = [];
    for await (const chunk of req.body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // رفع الصورة إلى IPFS باستخدام Pinata
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: `image-${Date.now()}.jpg`,
    });

    const pinataResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
      }
    );

    const ipfsHash = pinataResponse.data.IpfsHash;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    return new Response(
      JSON.stringify({ success: true, data: { url: ipfsUrl } }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('فشل رفع الصورة إلى IPFS:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'فشل رفع الصورة إلى IPFS' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
