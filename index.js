// index.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const documentController = require('./documentController');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Configure Multer for handling file uploads
const upload = multer({ dest: 'public/uploads/' });

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Document Intelligence API',
            description: 'API for extracting text from documents using Azure AI Document Intelligence',
            version: '1.0.0'
        },
        servers: [{
            url: 'http://localhost:3000',
            description: 'Development server'
        }]
    },
    apis: ['index.js'] // Specify the file that contains your route definitions
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to handle file upload and text extraction
/**
 * @swagger
 * /extractText:
 *   post:
 *     summary: Extract text from a document
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The document file to be processed
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 document:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Extracted text from the document
 */
app.post('/extractText', upload.single('file'), documentController.handleExtractText);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
