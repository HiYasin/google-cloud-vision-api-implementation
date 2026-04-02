import { NextFunction, Request, Response } from 'express';
import multer from "multer";
import path from "path";
import config from "../config";

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads/'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

export const multerUpload = multer({
    storage,
    limits: {
        fileSize: parseInt(config.max_file_size) || 5242880, // 5MB default
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
})

/**
 * Middleware for single file upload
 */
export const multerSingleUpload = (req: Request, res: Response, next: NextFunction) => {
    const uploadSingle = multerUpload.single('image');
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: "File too large",
                    message: `Maximum file size is ${config.max_file_size || 5242880} bytes`
                });
            }
            return res.status(400).json({
                success: false,
                error: "File upload error",
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: "Upload error",
                message: err.message
            });
        }
        next();
    });
}

/**
 * Middleware for dual file upload (front and back images)
 */
export const multerDualUpload = (req: Request, res: Response, next: NextFunction) => {
    const uploadFields = multerUpload.fields([
        { name: 'frontImage', maxCount: 1 },
        { name: 'backImage', maxCount: 1 }
    ]);
    
    uploadFields(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: "File too large",
                    message: `Maximum file size is ${config.max_file_size || 5242880} bytes`
                });
            }
            return res.status(400).json({
                success: false,
                error: "File upload error",
                message: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: "Upload error",
                message: err.message
            });
        }
        
        // Validate that both files are present
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (!files?.frontImage || !files?.backImage) {
            return res.status(400).json({
                success: false,
                error: "Both front and back images are required"
            });
        }
        
        next();
    });
}

// Multer error handler reference: https://stackoverflow.com/questions/30838901/error-handling-when-uploading-file-using-multer-with-expressjs

// mutler error handler reference: https://stackoverflow.com/questions/30838901/error-handling-when-uploading-file-using-multer-with-expressjs