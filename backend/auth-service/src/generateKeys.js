const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 1. Tạo cặp khóa RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

// 2. Chuyển đổi ký tự xuống dòng thành \n thô
const formattedPrivateKey = privateKey.replace(/\n/g, '\\n');
const formattedPublicKey = publicKey.replace(/\n/g, '\\n');

// 3. Ghi vào file .env.example
const filePath = path.join(__dirname, '../.env.example');
const content = `\nJWT_PRIVATE_KEY="${formattedPrivateKey}"\nJWT_PUBLIC_KEY="${formattedPublicKey}"\n`;

try {
  fs.appendFileSync(filePath, content, 'utf8');
  console.log('Đã tạo xong cặp khóa!');
} catch (err) {
  console.error('Lỗi ghi file:', err);
}
