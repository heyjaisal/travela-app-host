import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Feature = ({ formData, setformData }) => {
  const handleAddTodo = () => {
    if (formData.featurestext.trim() === "") return;

    if (formData.editfeatures) {
      setformData((prev) => ({
        ...prev,
        features: prev.features.map((todo) =>
          todo.id === prev.editfeatures
            ? { ...todo, text: prev.featurestext }
            : todo
        ),
        featurestext: "",
        editfeatures: null,
      }));
    } else {
      const newTodo = {
        id: Date.now(),
        text: formData.featurestext.trim(),
      };
      setformData((prev) => ({
        ...prev,
        features: [...prev.features, newTodo],
        featurestext: "",
      }));
    }
  };

  const handleEditTodo = (id) => {
    const todoToEdit = formData.features.find((todo) => todo.id === id);
    setformData((prev) => ({
      ...prev,
      featurestext: todoToEdit.text,
      editfeatures: id,
    }));
  };

  const handleDeleteTodo = (id) => {
    setformData((prev) => ({
      ...prev,
      features: prev.features.filter((todo) => todo.id !== id),
    }));
  };

  return (
    <div>
      {/* Add Todo Input and Button */}
      <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">Features</label>
    <div className="flex">
        <input
          type="text"
          name="featurestext"
          value={formData.featurestext}
          onChange={(e) =>
            setformData((prev) => ({
              ...prev,
              featurestext: e.target.value,
            }))
          }
          placeholder="Add a feature"
         className="mt-2 block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
        />
        <button
          onClick={handleAddTodo}
          className="ml-4 mt-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {formData.editfeatures ? "Edit" : "Add"}
        </button>
        </div>
     

      {/* Todo List */}
      <ul>
        {formData.features.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center mt-2 p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            <span className="cursor-pointer text-gray-800">{todo.text}</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleEditTodo(todo.id)}
                className="text-blue-500 hover:text-blue-700 focus:outline-none"
                title="Edit"
              >
                <FaEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                title="Delete"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Feature;
