import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
      trim: true,
    },
    edition: {
      type: Number,
      min: [1, "Edition must be at least 1"],
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    available: {
      type: String,
      enum: ["Available", "Requested", "Borrowed", "Returned"],
      default: "Available",
    },
    bookImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ bookName: 1 }); // Search optimization
bookSchema.index({ owner: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
