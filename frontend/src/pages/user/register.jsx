import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./register.css";
import { Server_URL } from "../../utils/config";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "user",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${Server_URL}users/register`,
        data
      );

      if (response.data?.error) {
        showErrorToast(response.data.message);
        return;
      }

      showSuccessToast("Registration successful!");
      reset({ role: "user" }); // reset role to default
    } catch (error) {
      showErrorToast(
        error.response?.data?.message || "Registration failed!"
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Create Account</h2>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              className="register-input"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="register-error">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="register-input"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="register-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="register-input"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="register-error">{errors.password.message}</p>
            )}
          </div>

          {/* Stream */}
          <div className="form-group">
            <label>Stream</label>
            <input
              className="register-input"
              {...register("stream", { required: "Stream is required" })}
            />
            {errors.stream && (
              <p className="register-error">{errors.stream.message}</p>
            )}
          </div>

          {/* Year */}
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              className="register-input"
              {...register("year", {
                required: "Year is required",
                min: { value: 2001, message: "Minimum year is 1" },
                max: { value: 2025, message: "Maximum year is 5" },
              })}
            />
            {errors.year && (
              <p className="register-error">{errors.year.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role</label>
            <select
              className="register-input"
              {...register("role", { required: "Role is required" })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
            </select>
            {errors.role && (
              <p className="register-error">{errors.role.message}</p>
            )}
          </div>

          {/* Submit */}
          <button className="register-btn" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
