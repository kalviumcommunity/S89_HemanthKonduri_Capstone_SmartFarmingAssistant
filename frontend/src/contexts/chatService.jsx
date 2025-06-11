// frontend/src/services/chatService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const sendMessageToBackend = async (message, history, retries = 3, delay = 1000) => {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, history }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... Attempts left: ${retries}`);
            await new Promise(res => setTimeout(res, delay));
            return sendMessageToBackend(message, history, retries - 1, delay * 2);
        } else {
            console.error("Error sending message to backend:", error);
            throw error;
        }
    }
};
