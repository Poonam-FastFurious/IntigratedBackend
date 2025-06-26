import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Team", "Board"], // "Team" = Team Member, "Board" = Board of Directors
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
