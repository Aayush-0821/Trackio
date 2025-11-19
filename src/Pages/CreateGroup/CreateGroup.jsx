import React, { useState } from "react";
import { useForm } from "react-hook-form";
import createGroupbgLight from "../../assets/createGroupbgLight.png";
import createGroupbgDark from "../../assets/createGroupbgDark.png";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const CreateGroup = ({ close3, theme }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const { backendUrl } = useContext(AppContext);

  const addTodo = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: task }]);
    setTask("");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onSubmit = async (data) => {
    const payload = {
      groupName: data.groupName,
      topic: data.groupTopic,
      description: data.groupDescription,
      todoList: todos.map((todo) => ({ task: todo.text })),
    };

    try {
      const response = await fetch(`${backendUrl}/api/group/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTodos([]);
        close3();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error Creating group:", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div
      className="bg-cover bg-center w-[600px] max-w-[95vw] rounded-2xl border-2 border-orange-400 shadow-lg p-8 relative flex gap-8"
      style={
        theme === "light"
          ? { backgroundImage: `url(${createGroupbgLight})` }
          : { backgroundImage: `url(${createGroupbgDark})` }
      }
    >
      {/* Close Button */}
      <button
        onClick={close3}
        className="absolute top-3 right-4 text-orange-500 hover:text-orange-600 text-4xl font-bold cursor-pointer"
      >
        &times;
      </button>

      {/* Left Section */}
      <div className="flex-1">
        <h1
          className={
            theme === "light"
              ? "text-3xl font-bold fjalla mb-6 text-black"
              : "text-3xl font-bold fjalla mb-6 text-white"
          }
        >
          Let's build your community
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Group Name */}
          <div>
            <p
              className={
                theme === "light"
                  ? "text-sm font-medium mb-1 text-black"
                  : "text-sm font-medium mb-1 text-white"
              }
            >
              Group Name*
            </p>
            <input
              type="text"
              placeholder="Ex: Learn React!"
              className={
                theme === "light"
                  ? `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupName ? "border-red-500" : "border-orange-500"
                    } bg-transparent text-black placeholder-gray-500`
                  : `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupName ? "border-red-500" : "border-orange-500"
                    } bg-transparent text-white placeholder-gray-500`
              }
              {...register("groupName", { required: "Group Name is required" })}
            />
            {errors.groupName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.groupName.message}
              </p>
            )}
          </div>

          {/* Group Topic */}
          <div>
            <p
              className={
                theme === "light"
                  ? "text-sm font-medium mb-1 text-black"
                  : "text-sm font-medium mb-1 text-white"
              }
            >
              Group Topic*
            </p>
            <input
              type="text"
              placeholder="React"
              className={
                theme === "light"
                  ? `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupTopic ? "border-red-500" : "border-orange-500"
                    } bg-transparent text-black placeholder-gray-500`
                  : `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupTopic ? "border-red-500" : "border-orange-500"
                    } bg-transparent text-white placeholder-gray-500`
              }
              {...register("groupTopic", { required: "Group Topic is required" })}
            />
            {errors.groupTopic && (
              <p className="text-red-500 text-sm mt-1">
                {errors.groupTopic.message}
              </p>
            )}
          </div>

          {/* Group Description */}
          <div>
            <p
              className={
                theme === "light"
                  ? "text-sm font-medium mb-1 text-black"
                  : "text-sm font-medium mb-1 text-white"
              }
            >
              Group Description
            </p>
            <textarea
              rows="3"
              placeholder="We created this group to learn React.js!"
              className={
                theme === "light"
                  ? `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupDescription
                        ? "border-red-500"
                        : "border-orange-500"
                    } bg-transparent text-black placeholder-gray-500`
                  : `w-full border-2 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.groupDescription
                        ? "border-red-500"
                        : "border-orange-500"
                    } bg-transparent text-white placeholder-gray-500`
              }
              {...register("groupDescription", {
                required: "Group Description is required",
              })}
            />
            {errors.groupDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.groupDescription.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-1/3 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer"
          >
            Create Group
          </button>
        </form>
      </div>

      {/* Right Section Removed Safely */}
      {/* (Previously buggy commented block removed) */}
    </div>
  );
};

export default CreateGroup;
