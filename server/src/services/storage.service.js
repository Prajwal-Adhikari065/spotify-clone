import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
});

const response = await client.files.upload({
  file: fs.createReadStream('path/to/file'),
  fileName: 'file-name.jpg',
});

console.log(response);