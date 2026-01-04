import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

const AddBookForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const url = Server_URL + "books/add";

      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { error, message } = response.data;

      if (error) {
        showErrorToast(message);
      } else {
        showSuccessToast(message);
        reset();
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      showErrorToast("Failed to add book!");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📚 Add a New Book</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 shadow-sm bg-light rounded"
      >
        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label">Book Title</label>
          <input
            type="text"
            className="form-control"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <small className="text-danger">{errors.title.message}</small>
          )}
        </div>

        {/* AUTHOR */}
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            {...register("author", { required: "Author is required" })}
          />
          {errors.author && (
            <small className="text-danger">{errors.author.message}</small>
          )}
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
          </select>
          {errors.category && (
            <small className="text-danger">{errors.category.message}</small>
          )}
        </div>

        {/* ISBN */}
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            {...register("isbn", { required: "ISBN is required" })}
          />
          {errors.isbn && (
            <small className="text-danger">{errors.isbn.message}</small>
          )}
        </div>

        {/* IMAGE URL (TEXT INPUT) */}
        <div className="mb-3">
          <label className="form-label">Book Cover Image URL</label>
          <input
            type="text"
            className="form-control"
            placeholder="https://example.com/book.jpg"
            {...register("coverImage", {
              required: "Cover image URL is required",
            })}
          />
          {errors.coverImage && (
            <small className="text-danger">{errors.coverImage.message}</small>
          )}
        </div>

        {/* TOTAL COPIES */}
        <div className="mb-3">
          <label className="form-label">Total Copies</label>
          <input
            type="number"
            className="form-control"
            {...register("totalCopies", { required: true, min: 1 })}
          />
        </div>

        {/* PRICE */}
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            {...register("price", { required: true })}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            {...register("description", {
              required: "Description is required",
            })}
          ></textarea>
          {errors.description && (
            <small className="text-danger">
              {errors.description.message}
            </small>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBookForm;
