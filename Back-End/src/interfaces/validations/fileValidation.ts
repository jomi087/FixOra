function validateFile(file: Express.Multer.File, allowedTypes: string[], maxSizeMB: number): string | null {
    if (!allowedTypes.includes(file.mimetype)) {
        return `Invalid file type: ${file.originalname} (${file.mimetype})`;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        return `${file.originalname} exceeds ${maxSizeMB}MB`;
    }
    return null; // no error
}

export default validateFile;


