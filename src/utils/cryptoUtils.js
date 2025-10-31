import CryptoJS from "crypto-js";

const MESSAGE_SECRET_KEY = "LSKDJFL3K4JJKFDLLJL45PMNE4N5"; // use same key as backend for consistency

export const decryptMessage = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, MESSAGE_SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error("Error decrypting message:", error);
    return "[Invalid Encrypted Data]";
  }
};
