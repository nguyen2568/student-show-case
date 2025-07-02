import base64, hashlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import base64
from dotenv import load_dotenv
import os

# Define your AES decryption key (must match the encryption key used in CryptoJS)
def decrypt_qr_data(encrypted_data):
    try:
        load_dotenv()
        encryption_key = os.getenv("ENCRYPTION_KEY")
        iv_b64, ct_b64 = encrypted_data.split(":", 1)
        iv = base64.b64decode(iv_b64)
        ct = base64.b64decode(ct_b64)
        key = hashlib.sha256(encryption_key.encode()).digest()  # same 32-byte key
        pt = AES.new(key, AES.MODE_CBC, iv).decrypt(ct)
        return unpad(pt, AES.block_size).decode()
    except Exception as e:
        print(f"Error decoding: {e}")
        return None
    

#Test the function
# if __name__ == "__main__":
#     # Example encrypted data and key
#     encrypted_data = "LTJ2F312KLa/9glXQGmMGw==:HknTjlEn0XDiPNQryxeFXARJdwulIV/o86O1UTwMijE="  # Replace with actual encrypted data
#     encryption_key = "a0f3c1b2d4e5b8c7f9e6a2d3b4c5e6f7"  # Replace with your actual encryption key

#     decrypted_data = decrypt_qr_data(encrypted_data)
#     print("Decrypted Data:", decrypted_data)