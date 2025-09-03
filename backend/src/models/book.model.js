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
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
    url: {
      type: String,
      default: null,
      trim: true,
      validate: {
        validator: function(v) {
          // If url is provided, validate it's a proper URL format
          if (v === null || v === '') return true;
          
          // Comprehensive URL regex that handles most common cases
          const urlPattern = /^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,63})([\/\w \.\-~:?#\[\]@!$&'()*+,;=%]*)*\/?$/i;
          
          // Block dangerous protocols
          const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
          if (dangerousProtocols.test(v)) {
            return false;
          }
          
          return urlPattern.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    status: {
      type: String,
      enum: ["Pending","Rejected","Approved"],
      default: "Pending",
    },
    feedback: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ bookName: 1 }); // Search optimization
bookSchema.index({ owner: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
