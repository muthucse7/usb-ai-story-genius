const fs = require("fs");
const { OpenAIClient } = require("@azure/openai");
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const {
  azureDocumentIntelligenceAIEndpoint,
  azureDocumentIntelligenceAIApiKey,
  azureOpenAIServiceEndpoint,
  azureOpenAIServiceApiKey,
} = require("./config");

const client = new OpenAIClient(
  azureOpenAIServiceEndpoint,
  new AzureKeyCredential(azureOpenAIServiceApiKey)
);

// Extract text from the document using Azure AI Document Intelligence
async function extractText(filePath) {
  try {
    // Perform text extraction using Azure AI Document Intelligence
    const fileStream = fs.createReadStream(filePath);
    const documentAnalysisClient = new DocumentAnalysisClient(
      azureDocumentIntelligenceAIEndpoint,
      new AzureKeyCredential(azureDocumentIntelligenceAIApiKey)
    );
    const poller = await documentAnalysisClient.beginAnalyzeDocument(
      "prebuilt-read",
      fileStream
    );
    const { content } = await poller.pollUntilDone();

    return content;
  } catch (error) {
    throw new Error("Error processing file:", error);
  }
}

// Generate user stories based on the extracted content using OpenAI GPT-3
async function generateUserStories(content) {
  try {
    const prompt = `Based on the following content, generate list user stories with proper acceptance criteria :\n\n${content}`;
    const { choices } = await client.getCompletions(
      "StoryGeniusOpenAIService", // assumes a matching model deployment or model name
      [prompt]
    );
    console.log("inside generateUserStories", choices);
    return choices[0].text.trim();
  } catch (error) {
    throw new Error("Error generating user stories:", error);
  }
}

module.exports = {
  extractText,
  generateUserStories,
};
