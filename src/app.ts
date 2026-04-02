import { validateEmiratesId } from './services/emiratesIdValidation.utils';
import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { safeFileCleanup } from "./helper/safeCleanUp";
import { recognizeDocumentText } from "./helper/googleCloudVisionApi";
import { multerDualUpload, multerSingleUpload } from "./helper/upload";
import { emiratesId } from "./services/emiratesIdValidation.service";

const app = express();
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/", async (req: Request, res: Response) => {
    res.send({
        status: "success",
        message: "Emirates ID OCR Server is running",
        version: "1.0.0",
        endpoints: [
            "GET /",
            "POST /get-text",
            "POST /get-frontside-data",
            "POST /get-backside-data",
            "POST /validate-emirates-id"
        ]
    });
});





// Get raw text from image using Google Cloud Vision API
app.post("/get-text", multerSingleUpload, async (req, res) => {
    const filePath = req.file?.path;

    try {
        if (!req.file || !filePath) {
            return res.status(400).json({ 
                success: false,
                error: "No file provided" 
            });
        }

        const startTime = Date.now();
        const result = await recognizeDocumentText(filePath);
        const processingTime = Date.now() - startTime;

        await safeFileCleanup(filePath);

        return res.json({
            success: true,
            data: {
                text: result.text,
                processingTime: `${processingTime}ms`,
            },
        });
    } catch (error) {
        console.error("Error processing file:", error);

        if (filePath) {
            await safeFileCleanup(filePath);
        }

        return res.status(500).json({
            success: false,
            error: "Failed to process file",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});





// Extract structured data from Emirates ID front side
app.post("/get-frontside-data", multerSingleUpload, async (req, res) => {
    const filePath = req.file?.path;

    try {
        if (!req.file || !filePath) {
            return res.status(400).json({ 
                success: false,
                error: "No file provided" 
            });
        }

        const startTime = Date.now();

        // Extract text using Google Cloud Vision
        const textResult = await recognizeDocumentText(filePath);

        if (!textResult || !textResult.text) {
            await safeFileCleanup(filePath);
            return res.status(400).json({ 
                success: false,
                error: "No text detected in the image" 
            });
        }

        // Process with AI to get structured data
        const structuredData = await emiratesId.getJsonDataFrontSide(textResult.text);
        const processingTime = Date.now() - startTime;

        await safeFileCleanup(filePath);

        return res.json({
            success: true,
            data: {
                rawText: textResult.text,
                extractedData: structuredData,
                processingTime: `${(processingTime / 1000).toFixed(2)}s`,
            },
        });
    } catch (error) {
        console.error("Error processing front side:", error);

        if (filePath) {
            await safeFileCleanup(filePath);
        }

        return res.status(500).json({
            success: false,
            error: "Failed to process Emirates ID front side",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});





// Extract structured data from Emirates ID back side
app.post("/get-backside-data", multerSingleUpload, async (req, res) => {
    const filePath = req.file?.path;

    try {
        if (!req.file || !filePath) {
            return res.status(400).json({ 
                success: false,
                error: "No file provided" 
            });
        }

        const startTime = Date.now();

        // Extract text using Google Cloud Vision
        const textResult = await recognizeDocumentText(filePath);

        if (!textResult || !textResult.text) {
            await safeFileCleanup(filePath);
            return res.status(400).json({ 
                success: false,
                error: "No text detected in the image" 
            });
        }

        // Process with AI to get structured data
        const structuredData = await emiratesId.getJsonDataBackSide(textResult.text);
        const processingTime = Date.now() - startTime;

        await safeFileCleanup(filePath);

        return res.json({
            success: true,
            data: {
                rawText: textResult.text,
                extractedData: structuredData,
                processingTime: `${(processingTime / 1000).toFixed(2)}s`,
            },
        });
    } catch (error) {
        console.error("Error processing back side:", error);

        if (filePath) {
            await safeFileCleanup(filePath);
        }

        return res.status(500).json({
            success: false,
            error: "Failed to process Emirates ID back side",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});




app.post("/get-both-sides", multerDualUpload, async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const frontPath = files.frontImage[0].path;
    const backPath = files.backImage[0].path;

    try {
        const startTime = Date.now();

        // Process both sides in parallel for better performance
        const [frontTextResult, backTextResult] = await Promise.all([
            recognizeDocumentText(frontPath),
            recognizeDocumentText(backPath)
        ]);

        if (!frontTextResult?.text || !backTextResult?.text) {
            throw new Error("Failed to extract text from one or both images");
        }
        
        // Extract structured data from both sides
        const bothData = await emiratesId.getJsonDataBothSides(frontTextResult.text, backTextResult.text);
        const processingTime = Date.now() - startTime;
        // Clean up files
        await Promise.all([
            safeFileCleanup(frontPath),
            safeFileCleanup(backPath)
        ]);
        
        return res.json({
            success: true,
            data: {
                frontSide: bothData.frontSide,
                backSide: bothData.backSide,
                processingTime: `${processingTime / 1000}s`,
            }
        });

    } catch (error) {
        console.error("Error processing both sides:", error);

        // Clean up files on error
        await Promise.all([
            safeFileCleanup(frontPath),
            safeFileCleanup(backPath)
        ]);

        return res.status(500).json({
            success: false,
            error: "Failed to process both sides of Emirates ID",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});





app.post("/validate-emirates-id", multerDualUpload, async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const frontPath = files.frontImage[0].path;
    const backPath = files.backImage[0].path;

    try {
        const startTime = Date.now();

        // Process both sides in parallel for better performance
        const [frontTextResult, backTextResult] = await Promise.all([
            recognizeDocumentText(frontPath),
            recognizeDocumentText(backPath)
        ]);

        if (!frontTextResult?.text || !backTextResult?.text) {
            throw new Error("Failed to extract text from one or both images");
        }

        // Extract structured data from both sides
        const bothData = await emiratesId.getJsonDataBothSides(frontTextResult.text, backTextResult.text);

        // Validate the ID
        const validation = await validateEmiratesId(bothData.frontSide, bothData.backSide);
        const processingTime = Date.now() - startTime;

        // Clean up files
        await Promise.all([
            safeFileCleanup(frontPath),
            safeFileCleanup(backPath)
        ]);

        return res.json({
            success: true,
            data: {
                frontSide: bothData.frontSide,
                backSide: bothData.backSide,
                validation: validation,
                processingTime: `${(processingTime / 1000).toFixed(2)}s`,
            }
        });

    } catch (error) {
        console.error("Error validating Emirates ID:", error);

        // Clean up files on error
        await Promise.all([
            safeFileCleanup(frontPath),
            safeFileCleanup(backPath)
        ]);

        return res.status(500).json({
            success: false,
            error: "Failed to validate Emirates ID",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
});





//  Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error",
        message: err.message
    });
});






app.listen(config.port, () => {
    console.log(`🚀 Emirates ID OCR Server listening on port ${config.port}`);
    console.log(`📝 API Documentation available at http://localhost:${config.port}/`);
});

export default app;