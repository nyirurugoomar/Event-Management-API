import { Schema, model, models } from "mongoose";

const LocationSchema = new Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    { timestamps: true }
);

const Location = models.Location || model("Location", LocationSchema);
export default Location;
