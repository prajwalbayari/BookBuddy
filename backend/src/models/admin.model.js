import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});

adminSchema.index({ adminEmail: 1 }, { unique: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
