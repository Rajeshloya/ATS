import mongoose from "mongoose";

// Define Candidate Schema and Model
const candidateSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    currentLocation: String,
    totalExperience: Number,
    technology: String,
    technology_stack: String,
    fileUrl: String
});
const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate