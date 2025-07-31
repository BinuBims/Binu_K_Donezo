import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos() {
  const modalRef = useRef();
  const toggleNewTodoModal = () => {
    // Check if the modal is currently open by accessing the `open` property of `modalRef`.
    if (modalRef.current.open) {
      // If the modal is open, close it by calling the `close()` method.
      modalRef.current.close();
    } else {
      // If the modal is not open, open it by calling the `showModal()` method.
      modalRef.current.showModal();
    }
  }
  const { register, handleSubmit } = useForm({ 
  defaultValues: { 
    name: "", 
    description: "" 
  } 
});

const handleNewTodo = (values) => {
  toggleNewTodoModal();
}
  function NewToDoButton() {
    return (
      <button className="btn btn-primary" onClick={toggleNewTodoModal}>
        New Todo
      </button>
    )
  }
  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("name")} 
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("description")}
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button type="button" className="btn btn-ghost" onClick={toggleNewTodoModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    )
  }
}
