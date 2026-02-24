import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "sales"],
      default: "sales",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("User", userSchema);
