import Joi from "joi";
import { sendResponse } from "../helpers/Response.js";
import taskSchema from "../models/task.schema.js";
import { parse, parseISO } from "date-fns";

let addvalidation = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\s]+$/) // Only allows letters, numbers, and spaces
    .required()
    .messages({
      "string.pattern.base": "Title must not contain special characters",
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),
  descriptions: Joi.string().required(),
  Completed: Joi.boolean(),
  created: Joi.string().required(),
  priority: Joi.string().required(),
});
export const add = async (req, res) => {
  try {
    const { error } = addvalidation.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, error?.details[0]?.message);
    }
    let { title, descriptions, created, priority, Completed } = req.body;
    console.log("cames");
    if (created) {
      created = parse(created, "yyyy-MM-dd", new Date());
    }
    const alreadyExist = await taskSchema.findOne({ title });
    if (alreadyExist)
      return sendResponse(res, 400, null, "Task with same title already");

    const newTask = new taskSchema({
      title,
      descriptions,
      created,
      priority,
      Completed,
      user: req.user.id,
    });
    await newTask.save();
    return sendResponse(res, 201, newTask, "Task added successfully");
  } catch (err) {
    console.log("🚀 ~ add ~ err:", err);
    return sendResponse(res, 500, null, err.message);
  }
};

export const getAllTask = async (req, res) => {
  try {
    const task = await taskSchema.find({ user: req.user.id });
    return sendResponse(res, 200, task, "Fetched all tasks Successfully");
  } catch (err) {
    return sendResponse(res, 500, null, err.message);
  }
};

export const getAllTaskById = async (req, res) => {
  console.log("🚀 ~ getAllTaskById ~ req:", req);
  try {
    const task = await taskSchema.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return sendResponse(res, 404, null, "Task not found");
    return sendResponse(res, 200, task, "task details fetched successfully");
  } catch (err) {
    return sendResponse(res, 500, null, err.message);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { error } = addvalidation.validate(req.body);
    if (error) {
      return sendResponse(res, 400, null, error?.details[0]?.message);
    }

    // const userId = req.params.userId;

    // if (req.body.created) {
    //   req.body.created = parse(req.body.created, "dd/MM/yyyy", new Date());
    // }
    if (req.body.created) {
      req.body.created = parseISO(req.body.created);
    }
    const updatedTask = await taskSchema.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedTask) return sendResponse(res, 404, null, "task not found");
    return sendResponse(
      res,
      200,
      updatedTask,
      "task details updated successfully"
    );
  } catch (err) {
    return sendResponse(res, 500, null, err.message);
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const updatedTask = await taskSchema.findOneAndUpdate(
      { _id: req.params.id },
      { Completed: req.body.Completed },
      { new: true }
    );
    if (!updatedTask) return sendResponse(res, 404, null, "task not found");
    return sendResponse(
      res,
      200,
      updatedTask,
      "task details updated successfully"
    );
  } catch (err) {
    return sendResponse(res, 500, null, err.message);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await taskSchema.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletedTask) return sendResponse(res, 404, null, "Task not found");
    return sendResponse(res, 200, null, "Task deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, null, err.message);
  }
};
