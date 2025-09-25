// models/categoryModel.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  image: {
  public_id: String,
  url: String,
}

}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
