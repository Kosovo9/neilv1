import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../utils/logger';

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_REGION = 'auto';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

const s3 = new S3Client({
    region: R2_REGION,
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    },
    forcePathStyle: true // Required for R2 compatibility
});

export async function uploadToR2(buffer: Buffer | Uint8Array, key: string, contentType: string = 'application/octet-stream') {
    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType
        });
        await s3.send(command);
        logger.log(`Archivo subido a R2: ${key}`);
        return {
            success: true,
            url: `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`,
            key
        };
    } catch (error) {
        logger.error('Error subiendo archivo a R2:', error);
        return { success: false, error: error.message };
    }
}

export async function generateSignedUrl(key: string, expiresIn = 3600) {
    try {
        const command = new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
        const url = await getSignedUrl(s3, command, { expiresIn });
        return { success: true, url, expiresAt: Date.now() + expiresIn * 1000 };
    } catch (error) {
        logger.error('Error generando URL firmada:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteFromR2(key: string) {
    try {
        const command = new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
        await s3.send(command);
        logger.log(`Archivo eliminado de R2: ${key}`);
        return { success: true };
    } catch (error) {
        logger.error('Error eliminando archivo de R2:', error);
        return { success: false, error: error.message };
    }
}