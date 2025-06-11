// server/routes/chatRoutes.js
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const router = express.Router();

// --- Initialize Google Generative AI ---
let geminiModel;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey || geminiApiKey.startsWith("YOUR_")) {
    console.error(
        "\n***********************************************************************\n" +
        "FATAL ERROR: GEMINI_API_KEY is not set correctly or is a placeholder in .env.\n" +
        "The Chat API will not function.\n" +
        "Please set your actual GEMINI_API_KEY in the .env file.\n" +
        "***********************************************************************\n"
    );
} else {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        geminiModel = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest", // Or "gemini-pro"
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });
        console.log("Gemini AI Model initialized successfully for chat routes.");
    } catch (error) {
        console.error("Failed to initialize Gemini AI Model for chat routes:", error.message);
        geminiModel = null; // Ensure it's null if initialization fails
    }
}

router.post('/', async (req, res) => {
    // ... (if (!geminiModel) ... and input validation ... are the same)

    try {
        const { message, history } = req.body;

        // ... (message validation is the same) ...

        let validHistory = Array.isArray(history) ? history.filter(
            msg => msg && typeof msg.role === 'string' && Array.isArray(msg.parts) && msg.parts.length > 0 && typeof msg.parts[0].text === 'string'
        ) : [];

        // --- FIX: Ensure history starts with a user message or is empty ---
        // If the history is not empty and its first message is from the 'model',
        // and there are no 'user' messages before it, then we should probably send an empty history
        // for the very first turn, or adjust it.
        // A simpler fix: if the first message in the history is 'model', and the user is sending their first *actual* message,
        // then the history for the API call should effectively be empty because the AI is responding to the *new* user message.
        if (validHistory.length > 0 && validHistory[0].role === 'model') {
            // Check if there's any 'user' message in this initial history.
            // If the only message is the initial bot greeting, then for the Gemini API,
            // this first real user interaction should start with an empty history.
            const hasUserMessageInHistory = validHistory.some(msg => msg.role === 'user');
            if (!hasUserMessageInHistory) {
                console.log("[ChatRoute] Initial history starts with 'model' and no prior 'user' message. Clearing history for API call.");
                validHistory = []; // Start fresh for the API if it's just the bot's greeting
            }
            // If there *is* a user message somewhere in history, but the *very first* is model,
            // this is still an issue for Gemini. The history must strictly alternate starting with user.
            // For now, the above handles the most common case: the first user message after the bot's greeting.
        }

        // --- More Robust History Validation (Optional but good) ---
        // Ensure valid alternation if history is not empty
        if (validHistory.length > 0) {
            if (validHistory[0].role !== 'user') {
                console.warn("[ChatRoute] Corrected history: First message was not 'user'. Attempting to fix or clear.");
                // This scenario is tricky. If it's [model, user, model], we need to drop the leading model.
                // For simplicity, if the very first message is 'model' after the above check,
                // and we still have it, it implies a malformed history.
                // Let's re-check if we should clear it.
                // This path is less likely if the frontend always sends the full message list.
                const firstUserIndex = validHistory.findIndex(msg => msg.role === 'user');
                if (firstUserIndex > 0) { // If 'user' is not the first, but exists
                    console.log(`[ChatRoute] History started with 'model'. Slicing from first 'user' message at index ${firstUserIndex}.`);
                    validHistory = validHistory.slice(firstUserIndex);
                } else if (firstUserIndex === -1) { // No user messages at all, only model
                    console.log("[ChatRoute] History contains only 'model' messages. Clearing history for API call.");
                    validHistory = [];
                }
            }
            // After ensuring first is user (if not empty), check alternation
            for (let i = 0; i < validHistory.length - 1; i++) {
                if (validHistory[i].role === validHistory[i+1].role) {
                    console.error("[ChatRoute] Invalid history: Consecutive messages have the same role. History will be truncated or cleared.");
                    // Potentially truncate or clear history here. For now, log and proceed, Gemini might also error.
                    // validHistory = []; // Simplest fix, but loses context
                    break;
                }
            }
        }


        console.log(`[ChatRoute] Starting chat. User message: "${message.substring(0,50)}..." Effective history items for API: ${validHistory.length}`);
        if (validHistory.length > 0) {
            console.log("[ChatRoute] Effective history for API:", JSON.stringify(validHistory, null, 2));
        }


        const chat = geminiModel.startChat({
            history: validHistory, // Pass the potentially adjusted history
        });

        // ... (rest of the code: sendMessage, response handling, etc. remains the same)
        const result = await chat.sendMessage(message.trim());
        const response = result.response;

        if (!response || !response.candidates || response.candidates.length === 0 || !response.candidates[0].content) {
            console.error("[ChatRoute] Gemini API Error: No valid response candidate. Possibly blocked.");
            // ... (error handling for no candidate)
            let errorMessage = 'Failed to get response from AI. The response might have been blocked by safety settings.';
            if (response?.promptFeedback?.blockReason) {
                errorMessage += ` Reason: ${response.promptFeedback.blockReason}.`;
            }
            return res.status(500).json({ error: errorMessage });
        }

        const botReplyText = response.text();
        console.log(`[ChatRoute] AI Reply: "${botReplyText.substring(0,100)}..."`);
        res.json({ reply: botReplyText });

    } catch (error) {
        // ... (your existing catch block for API errors)
        console.error('[ChatRoute] Error calling Gemini API or processing:', error.message);
        // ... (error handling based on error.message)
        return res.status(500).json({ error: 'Failed to get response from AI. An internal server error occurred.' });
    }
});

module.exports = router;