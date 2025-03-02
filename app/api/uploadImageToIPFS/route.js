import axios from 'axios';

export const config = {
  api: {
    bodyParser: false, // تعطيل التحليل التلقائي للبيانات
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);

      try {
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

        res.status(200).json({ success: true, data: { url: ipfsUrl } });
      } catch (error) {
        console.error('فشل رفع الصورة إلى IPFS:', error);
        res
          .status(500)
          .json({ success: false, message: 'فشل رفع الصورة إلى IPFS' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
