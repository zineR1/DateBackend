import admin from 'firebase-admin';
import serviceAccountKey from './service_key.json' assert { type: 'json' }; // Credenciales descargadas desde Firebase Console

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
    });
}

export const messaging = admin.messaging();