import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import TeamMember from "./TeamMember.model.js";
import fs from "fs";
export const addTeamMember = async (req, res) => {
  try {
    const { name, designation, category, order, isActive ,description } = req.body;
    const file = req.files?.file?.[0];
    if (!name || !designation || !category || !file) {
      return res
        .status(400)
        .json({ message: "All fields including image are required" });
    }

    const upload = await uploadOnCloudinary(file.path, {
      folder: "team-members",
    });

    fs.unlinkSync(file.path);

    const member = await TeamMember.create({
      name,
      designation,
      category,
      description,
      imageUrl: upload.secure_url,
      order: order || 0,
      isActive: isActive !== "false",
    });

    res.status(201).json({ message: "Member added", member });
  } catch (err) {
    console.error("Add member error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All
export const getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json({ members });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// Get by ID
export const getTeamMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });
    res.json({ member });
  } catch (err) {
    res.status(500).json({ message: "Error fetching member" });
  }
};

// Update
export const updateTeamMember = async (req, res) => {
  try {
    const { name, designation, category, order, isActive } = req.body;
    const file = req.files?.file?.[0];

    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });

    if (file) {
      const upload = await uploadOnCloudinary(file.path, {
        folder: "team-members",
      });
      fs.unlinkSync(file.path);
      member.imageUrl = upload.secure_url;
    }

    member.name = name || member.name;
    member.designation = designation || member.designation;
    member.category = category || member.category;
    member.order = order !== undefined ? order : member.order;
    member.isActive = isActive !== undefined ? isActive : member.isActive;

    await member.save();
    res.json({ message: "Member updated", member });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete
export const deleteTeamMember = async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
