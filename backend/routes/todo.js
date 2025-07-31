import express from "express";
const router = express.Router();
import prisma from "../db/index.js";

router.get('/', async (req, res) => {
    // Gets all the todos from the database
    const todos = await prisma.todo.findMany();
    // Responds back to the client with json with a success status and the todos array
    res.status(200).json({
        success: true,
        todos,
    });
});

// Define a POST route for creating a new todo
router.post('/', async (req, res) => {
    // Destructure `name` and `description` from the request body
    const { name, description } = req.body;
    try {
        // Use Prisma to create a new todo entry in the database
        const newTodo = await prisma.todo.create({
            data: {
                name,               // Set the name of the todo from the request
                description,        // Set the description of the todo from the request
                completed: false,   // Default value for `completed` is set to false
                userId: req.user.sub, // Assign the user ID
            },
        });
        
        // Check if the new todo was created successfully
        if (newTodo) {
            // Respond with a success status and include the ID of the newly created todo
            res.status(201).json({
                success: true,
                todo: newTodo.id,
            });
        } else {
            // Respond with a failure status if todo creation failed
            res.status(500).json({
                success: false,
                message: "Failed to create new todo",
            });
        }
    } catch (e) {
        // Log the error for debugging purposes
        console.log(e);
        // Respond with a generic error message if something goes wrong
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
});

//...GET and POST routes above

// Define a PUT route for marking a todo as completed
router.put("/:todoId/completed", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    // Fetch current todo
    const existingTodo = await prisma.todo.findUnique({
      where: { id: todoId },
    });

    if (!existingTodo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }

    // Toggle the completed value
    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        completed: !existingTodo.completed, // flip the boolean
      },
    });

    res.status(200).json({
      success: true,
      todo: updatedTodo,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});

// Define a DELETE route for removing a todo by its ID
// Define a DELETE route for removing a todo by its ID only if completed is true
router.delete("/:todoId", async (req, res) => {
  const todoId = Number(req.params.todoId);

  try {
    // First, check if a todo with that ID and completed=true exists
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        completed: true,
      },
    });

    // If not found or not completed, respond with 404
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or not completed yet",
      });
    }

    // If found and completed, delete it
    await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    res.status(200).json({
      success: true,
      message: `Todo with ID ${todoId} deleted`,
    });
  } catch (error) {
    console.error("DELETE /:todoId error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    });
  }
});



export default router;
