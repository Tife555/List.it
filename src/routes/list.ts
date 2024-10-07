import express from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { getAuthorsOfList } from "./authorlist";

const router = express.Router();
const prisma = new PrismaClient();

const listSchema = Joi.object({
    name: Joi.string().max(50).required(),
    tag: Joi.string().max(100).allow(null),
});

const listIdSchema = Joi.number().integer().positive().required();

// Create a new list

router.post("/list", async (req,res) => {

    // Validate input

    const { error } = listSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, tag } = req.body;

    try {
        const newList = await prisma.list.create({
            data: {
                name,
                tag
            }
        });

        res.status(201).json(newList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not create list"});
    }
});

// Delete a list

router.delete("/list/:id", async (req,res) => {

    // Validate input

    const {error} = listIdSchema.validate({id: Number(req.params.id)});
    if (error) return res.status(400).json({error: error.details[0].message});

    const id = Number(req.params.id);

    try {
        const deletedList = await prisma.list.delete({
            where: {
                id
            }
        });

        res.status(204).json(deletedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not delete list"});
    }
});

// Get all lists

router.get("/lists", async (req,res) => {

    try {
        const lists = await prisma.list.findMany({
            select: {
                id: true,
                name: true,
                tag: true,         
                createdAt: true,       
            },
        });
        res.status(200).json(lists);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not get lists"});
    }
});

// Get a specific list by ID

router.get("/list/:id", async (req,res) => {
     
    // Validate input

    const {error} = listIdSchema.validate({id: Number(req.params.id)});
    if (error) return res.status(400).json({error: error.details[0].message});

    const id = Number(req.params.id);

    try {
        const listInfo = await prisma.list.findFirstOrThrow({
            where: {
                id: id,
            },
            select: {
                name: true,
                tag: true,
                createdAt: true,
                authors: {
                    select: {
                        authorId: true,
                        listId: true,
                    },
                },
                entries: {
                    select: {
                        id: true,
                        statement: true,
                        color: true,
                    }
                }
            }
        })

        res.status(200).json(listInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not retrieve the list"});
    }
});

// Update a list

router.put("/list/:id", async (req,res) => {

    // Validate input

    const {error} = listIdSchema.validate({id: Number(req.params.id)});
    if (error) return res.status(400).json({error: error.details[0].message});

    const id = Number(req.params.id);

    const { name, tag } = req.body;

    try {
        const updatedList = await prisma.list.update({
            where: {
                id
            },
            data: {
                name,
                tag
            }
        });

        res.status(200).json(updatedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not update list"});
    }
});

// Get authors of list

router.get("/list/:id/authors", async (req,res) => {

    // Validate input

    const {error} = listIdSchema.validate({id: Number(req.params.id)});
    if (error) return res.status(400).json({error: error.details[0].message});

    const id = Number(req.params.id);

    try {
        const authorsOfList = await getAuthorsOfList(id);

        res.status(200).json(authorsOfList);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not get authors of list"});
    }
});

export default router;