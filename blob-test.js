import { put, list } from '@vercel/blob';

async function main() {
  // Проверим, что токен доступен
  console.log("Token:", process.env.BLOB_READ_WRITE_TOKEN);

  const blob = await put(
    'students.json',
    new Blob(['{"status":"ok"}']),
    {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // явно передаём токен
    }
  );

  console.log('Файл загружен:', blob.url);

  const files = await list({ token: process.env.BLOB_READ_WRITE_TOKEN });
  console.log('Все файлы:', files);
}

main();

