// documentController.js
const path = require('path');
const documentModel = require('./documentModel');

async function handleExtractText(req, res) {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Construct the local file path
        const filePath = path.join(__dirname, 'public', 'uploads', file.filename);

        // Extract text from the document
        const content = await documentModel.extractText(filePath);

        // Generate user stories from the extracted content
        const userStories = await documentModel.generateUserStories(content);

        // Prepare response data
        const responseData = {
            // document: { content },
            userStories: { userStories }
        };

        // Send response
        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleExtractText
};
