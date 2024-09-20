import { Schema, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    descriptions: { type: String, required: true, default: "" },
    Completed: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    priority: { type: String, required: true, default: "Low" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Task", TaskSchema);
