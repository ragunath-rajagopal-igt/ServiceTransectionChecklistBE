
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const ARCHIVE_DIR = `/uploads/archive`;  // Temp directory for initial uploads
const MAIN_DIR = `/uploads`;             // Main directory for final storage

/**
 * Function to configure file uploads with an initial archive destination.
 * @param {string} module - The name of the module for file-specific paths.
 * @returns {object} - Multer middleware for handling file uploads and file manipulation helpers.
 */
// file upload directoy
function fileUploadBasedModule(module) {
    // Set up multer for initial file uploads to the archive directory
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const archivePath = path.join(__dirname, `../${ARCHIVE_DIR}`);
            fs.mkdirSync(archivePath, { recursive: true });
            cb(null, archivePath);
        },
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
    });

    const upload = multer({ storage });

    return {
        upload,
        getFileDetails: (req) => {
            if (!req.file) return null;

            const filePath = path.join(`${ARCHIVE_DIR}`, req.file.filename);
            return {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fullPath: filePath,
                tempPath: filePath,   // Track the archive path as tempPath
            };
        },
        moveToModuleDir: (file) => {
            const fileName = file.fileName;
            const oldPath = path.join(__dirname, `../${ARCHIVE_DIR}`, fileName);
            const newDirPath = path.join(__dirname, `../${MAIN_DIR}/`, module);
            const newPath = path.join(newDirPath, fileName);

            fs.mkdirSync(newDirPath, { recursive: true });

            // Move the file from the archive directory to the module directory
            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
            }
            return { fullPath: newPath, fileName: fileName, originalName: file.originalName };
        },
        moveToArchiveDir: (file) => {
            const fileName = file.fileName;
            const newPath = path.join(__dirname, `../${ARCHIVE_DIR}`, fileName);
            const oldDirPath = path.join(__dirname, `../${MAIN_DIR}/`, module);
            const oldPath = path.join(oldDirPath, fileName);

            fs.mkdirSync(oldDirPath, { recursive: true });

            // Check if the file exists before moving
            if (fs.existsSync(oldPath)) {
                fs.renameSync(oldPath, newPath);
            }
            // Move the file from the archive directory to the module directory
            return { fullPath: newPath, fileName: fileName, originalName: file.originalName };
        }
    };
}


module.exports = { fileUploadBasedModule };

