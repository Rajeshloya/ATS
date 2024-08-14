import { PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3Client from '../config/awsConfig.js';
import Candidate from '../models/candidates.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const BUCKET = process.env.BUCKET;

// Configure Multer S3 for file uploads
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET,
        key: function (req, file, cb) {
            const folder = req.params.folder; // Get folder from request parameters
            const filePath = `${folder}/${file.originalname}`;
            cb(null, filePath);
        }
    })
});

class CandidateController {
    static uploadFile = upload.single('file');

    static async createCandidate(req, res) {
        const { firstName, lastName, currentLocation, totalExperience, technology, technology_stack, employment_type } = req.body;

        const candidate = new Candidate({
            firstName,
            lastName,
            currentLocation,
            totalExperience,
            technology,
            technology_stack,
            employment_type,
            fileUrl: req.file.location
        });

        try {
            await candidate.save();
            res.send(`Successfully uploaded to ${req.file.location} and saved candidate details!`);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async listFiles(req, res) {
        const folder = req.params.folder;
        try {
            const command = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `${folder}/` });
            const response = await s3Client.send(command);
            const files = response.Contents.filter(item => !item.Key.endsWith('/')).map(item => item.Key.split('/').pop());
            res.send(files);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async downloadFile(req, res) {
        const folder = req.params.folder;
        const filename = req.params.filename;
        try {
            const command = new GetObjectCommand({ Bucket: BUCKET, Key: `${folder}/${filename}` });
            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            res.send(url);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async deleteFile(req, res) {
        const { folder, filename } = req.params;
        try {
            const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: `${folder}/${filename}` });
            await s3Client.send(command);
            res.send("File Deleted Successfully");
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async searchCandidates(req, res) {
        const { technology, location } = req.query;

        const query = {};
        if (technology) {
            query.technology = { $regex: new RegExp(technology, "i") };
        }
        if (location) {
            query.currentLocation = { $regex: new RegExp(location, "i") };
        }

        try {
            const candidates = await Candidate.find(query);
            const fileNames = candidates.map(candidate => candidate.fileUrl.split('/').pop());
            res.send(fileNames);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    static async getAllCandidates(req, res) {
        try {
            const candidates = await Candidate.find();
            res.send(candidates);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default CandidateController;
