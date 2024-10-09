import { messaging } from "./firebaseAdmin.service.js";

export const sendWebNotification = async ({ token, title, body, link }) => {
    return await messaging.send({
        token,
        notification: {
            title,
            body,
        },
        webpush: link && {
            fcmOptions: {
                link,
            },
        },
    });
}

// Example:
// const response = await sendWebNotification({ token, title, body })