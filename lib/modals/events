import { Schema, model, models } from "mongoose";

const EventSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: Schema.Types.ObjectId, ref: "Location", required: true },  
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },  
        attendees: [{ type: Schema.Types.ObjectId, ref: "User" }]  
    },
    { timestamps: true }
);

const Event = models.Event || model("Event", EventSchema);
export default Event;
