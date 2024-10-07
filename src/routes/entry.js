import express from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const router = express.Router();
const prisma = new PrismaClient();

const entrySchema = Joi.object({
    statement: Joi.string().required(),
    listId: Joi.number().integer().positive().required(),
    enteredById: Joi.number().integer().positive().required(),
    statedById: Joi.number().integer().positive().required(),
    color: Joi.string().required(),
})

const entryIdSchema = Joi.number().integer().positive().required();

// Create a new entry

router.post("/entry", async (req,res) => {

    // Validate input

    const { error } = entrySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { statement, listId, enteredById, statedById, color } = req.body;

    try {
        const newEntry = await prisma.entry.create({
            data: {
                statement,
                listId,
                enteredById,
                statedById,
                color
            }
        });

        res.status(201).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not create entry"});
    }
})

// Delete an entry

router.delete("/entry/:id", async (req, res) => {

    // Validate input

    const id = Number(req.params.id);

    const { error } = entryIdSchema.validate(id);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const deletedEntry = await prisma.entry.delete({
            where: {
                id
            }
        });

        res.status(204).json(deletedEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete entry" });
    }
})

// Edit an entry

router.put("/entry/:id", async (req, res) => {

    // Validate input

    const id = Number(req.params.id);

    const { error: idError } = entryIdSchema.validate(id);
    if (idError) return res.status(400).json({ error: idError.details[0].message });

    const { error } = entrySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { statement, listId, enteredById, statedById, color } = req.body;

    try {
        const updatedEntry = await prisma.entry.update({
            where: {
                id
            },
            data: {
                statement,
                listId,
                enteredById,
                statedById,
                color
            }
        });

        res.status(200).json(updatedEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not update entry" });
    }
})

export default router;