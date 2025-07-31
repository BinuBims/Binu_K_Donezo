import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance";

import { CheckCircle, Trash2 } from "lucide-react"; // optional icons

export default function Todos() {
  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });


  const { data, isError, isLoading } = useQuery({
    // A unique key to identify this query in React Query's cache
    queryKey: ["todos"],
    // The function responsible for fetching the data
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();

      // Use the Axios instance to send a GET request to fetch the list of todos
      const { data } = await axiosInstance.get("http://localhost:8080/todos");
      console.log(data)

      // Return the fetched data (React Query will cache it under the queryKey)
      return data;
    }

  });

  const { mutate: deleteNewTodo } = useMutation({
    mutationKey:["deleteTodo"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient();

      const { data } = await axiosInstance.delete(`http://localhost:8080/todos/${todoId}`);

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });


  const { mutate: createNewTodo } = useMutation({
    // The key used to identify this mutation in React Query's cache
    mutationKey: ["newTodo"],

    // The function that performs the mutation (i.e., creating a new to-do)
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();

      // Use the Axios instance to make a POST request to the server, sending the new to-do data
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);

      // Return the response data (e.g., the newly created to-do object)
      return data;
    },
    onSuccess: () => {
      // This will be added later
      queryClient.invalidateQueries("todos");
    }
  });


  const { mutate: markAsCompleted } = useMutation({
    mutationKey: ["markAsCompleted"],
    mutationFn: async (todoId) => {
      const axiosInstance = await getAxiosClient();
      console.log(`task id ${todoId}`)

      const { data } = await axiosInstance.put(`http://localhost:8080/todos/${todoId}/completed`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    }
  });

  if (isLoading) {
    return (
      <div className="">Loading Todos...</div>
    )
  }

  if (isError) {
    return (
      <div className="">There was an error</div>
    )
  }

  console.log(`haha:${data}`)

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


  const handleNewTodo = (values) => {
    createNewTodo(values);
    toggleNewTodoModal();
  }
  function NewToDoButton() {
    return (
      <div className="flex justify-center mt-4">
        <button className="btn btn-primary" onClick={toggleNewTodoModal}>
          New Todo
        </button>
      </div>
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


  function TodoItemList() {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        {data?.success && data.todos.length >= 1 && (
          <ul className="flex flex-col gap-4">
            {[...data.todos]
              .sort((a, b) => a.completed - b.completed) // false (0) before true (1)
              .map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Dot + Task content */}
                  <div className="flex items-start gap-3">
                    <div className="text-xl text-red-500">&#128204;</div>
                    <div>
                      <h3 className="text-lg font-medium">{todo.name}</h3>
                      <p className="text-sm text-gray-600">{todo.description}</p>
                    </div>
                  </div>

                  {/* Checkbox + delete button */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600"
                      checked={todo.completed}
                      onChange={() => markAsCompleted(todo.id)}
                    />

                    {/* Placeholder for delete icon */}
                    <button
                      onClick={() => deleteNewTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }


  return (
    <>
      <NewToDoButton />
      <TodoItemList />
      <TodoModal />
    </>
  )
}
