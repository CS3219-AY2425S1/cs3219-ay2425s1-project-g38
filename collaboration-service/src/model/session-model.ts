import mongoose, { Schema } from "mongoose";

interface Session {
    session_id: string,
    date_created: Date,
    participants: string[],
    questionDescription : string,
    questionTestcases : string[],
    active: boolean
    activeUsers: string[],
    yDoc: Buffer,
    language: string,
}

const sessionSchema: Schema = new Schema({
    session_id: { type: String, unique: true },
    date_created: { type: Date, required: true },
    participants: {
        type: [String],
        required: true,
        validate: {
            validator: (v: string[]) => v.length == 2},
            message: "A session must have exactly 2 participants.",
        },
    questionDescription: { type: String, required: true },
    questionTestcases: { type: [String], required: true },
    active: { type: Boolean, default: true },
    activeUsers: { type: [String], default: [] },
    yDoc: { type: Buffer, required: true },
    language: { type: String, required: true },
});

export default mongoose.model<Session>("Session", sessionSchema);
