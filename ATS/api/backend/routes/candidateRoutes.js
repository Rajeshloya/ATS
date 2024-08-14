import express from 'express';
import CandidateController from '../controllers/candidateController.js';

const router = express.Router();

router.post('/upload/:folder', CandidateController.uploadFile, CandidateController.createCandidate);
router.get('/list/:folder', CandidateController.listFiles);
router.get('/download/:folder/:filename', CandidateController.downloadFile);
router.delete('/delete/:folder/:filename', CandidateController.deleteFile);
router.get('/candidates/search', CandidateController.searchCandidates);
router.get('/candidates', CandidateController.getAllCandidates);

export default router;
