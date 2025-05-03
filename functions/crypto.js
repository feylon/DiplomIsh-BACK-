import  crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Yoki doimiy kalit
const iv = crypto.randomBytes(16); // Initialization Vector

// Ma'lumotni shifrlash
export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    key: secretKey.toString('hex')
  };
}

// Ma'lumotni qayta ochish
export function decrypt(encryptedData, keyHex, ivHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(keyHex, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ======= TEST QILISH UCHUN ======= //
(()=>{const secretMessage = JSON.stringify({
    student_id : '96c13808-b8c7-41ae-8376-4e7244358314',
    expired_at : '2025-06-01T08:00:00Z',
    status : "enter"
});
const encrypted = encrypt(secretMessage);

console.log('🔒 Shifrlangan:', encrypted.encryptedData);

const decrypted = decrypt(encrypted.encryptedData, encrypted.key, encrypted.iv);

console.log('🔓 Qayta ochilgan:', decrypted);
});
