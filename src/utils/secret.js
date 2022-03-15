import CryptoJS from 'crypto-js'

const options = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
}

// 加密方法-Base64
export function encrypt(word, k = '0123456789abcdfe') {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const key = CryptoJS.enc.Utf8.parse(k)

  const encrypted = CryptoJS.AES.encrypt(srcs, key, options)
  return encrypted.toString()
}

// 解密方法-Base64
export function decrypt(word, k = '0123456789abcdfe') {
  const key = CryptoJS.enc.Utf8.parse(k)

  const decrypt = CryptoJS.AES.decrypt(word, key, options)
  return decrypt.toString(CryptoJS.enc.Utf8)
}

// 加密方法-Hex格式
export function encryptByHex(word, k = '0123456789abcdfe') {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const key = CryptoJS.enc.Utf8.parse(k)

  const encrypted = CryptoJS.AES.encrypt(srcs, key, options)
  return encrypted.ciphertext.toString()
}

// 解密方法-Hex格式
export function decryptByHex(word, k = '0123456789abcdfe') {
  const encryptedStr = CryptoJS.enc.Hex.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedStr)
  const key = CryptoJS.enc.Utf8.parse(k)

  const decrypt = CryptoJS.AES.decrypt(srcs, key, options)
  return decrypt.toString(CryptoJS.enc.Utf8)
}
