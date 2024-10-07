import express from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import { getListsOfAuthor } from "./authorlist";

const router = express.Router();
const prisma = new PrismaClient();

const authorSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    authorName: Joi.string().required(),
    password: Joi.string().min(8).required(),
});

const authorIdSchema = Joi.number().integer().positive().required();

// Create a new author

router.post("/author", async (req,res) => {

    // Validate input

    const { error } = authorSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, authorName, password } = req.body;

    try{
        const newAuthor = await prisma.author.create({
            data: {
                name,
                email,
                authorName,
                password
            }
        });

        res.status(201).json(newAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Could not create author"});
    }    
});

// Delete an author

router.delete("/author/:id", async (req,res) => {

    // Validate input

    const { error } = authorIdSchema.validate({ id: Number(req.params.id) });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = Number(req.params.id);

    try {
        const deletedAuthor = await prisma.author.delete({
            where: {
                id
            }
        });

        res.status(204).json(deletedAuthor);    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete author" });
    }
})

// Get all authors

router.get("/author", async (req, res) => {

    try {
        const authors = await prisma.author.findMany({
            select: {
                id: true,
                name: true,
                authorName: true,
                email: true,
                createdAt: true,
            },
        });

        res.status(200).json(authors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve all authors" });
    }
});

// Get a specific author by ID

router.get("/author/:id", async (req, res) => {

    // Validate input

    const { error } = authorIdSchema.validate({ id: Number(req.params.id) });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = Number(req.params.id);

    try {
        const authorInfo = await prisma.author.findFirstOrThrow({
            where: {
                id: id,
            },
            select: {
                name: true,
                authorName: true,
                email: true,
                createdAt: true,
                entries: {
                    select: {
                        id: true,
                        statement: true,
                        color: true,
                    },
                },
                statements: {
                    select: {
                        id: true,
                        statement: true,
                        color: true,
                    },
                },
                lists: {
                    select: {
                        authorId: true,
                        listId: true,
                    },
                },
            },
        });

        res.status(200).json(authorInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not retrieve the author" });
    }
});

// Update an author's data

router.put("/author/:id", async (req, res) => {

    // Validate input

    const { error } = authorIdSchema.validate({ id: Number(req.params.id) });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { error: validationError } = authorSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.details[0].message });

    const id = Number(req.params.id);
    const { name, email, authorName, password } = req.body;

    try {
        const updatedAuthor = await prisma.author.update({
            where: {
                id: id,
            },
            data: {
                name,
                email,
                authorName,
                password,
            },
        });

        res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not update author" });
    }
});

// Get all lists authored

router.get("/author/:id/lists", async (req, res) => {

    // Validate input

    const { error } = authorIdSchema.validate({ id: Number(req.params.id) });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const id = Number(req.params.id);

    try {
        const lists = await getListsOfAuthor(id);
        res.status(200).json(lists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not get lists for this author" });
    }
});

export default router;