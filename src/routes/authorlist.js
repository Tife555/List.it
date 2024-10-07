import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();

// Validation schema

const authorListSchema = Joi.object({
    authorId: Joi.number().integer().positive().required(),
    listId: Joi.number().integer().positive().required(),
});

const idSchema = Joi.number().integer().positive().required();

// Add author to list

export const addAuthorToList = async (authorId, listId) => {

    // Validate input

    const { error } = authorListSchema.validate({ authorId, listId })

    if (error) {
        throw new Error(error.details[0].message);
    }

    try{
        const newAuthorList = await prisma.authorList.create({
            data: {
                authorId,
                listId
            }
        });

        return newAuthorList;
    } catch (error) {
        console.error("Error adding author to list:",error);
        throw new Error("Could not add author to list.");        
    }
}

// Remove author from list

export const removeAuthorFromList = async (authorId, listId) => {
    
    // Validate input

    const { error } = authorListSchema.validate({ authorId, listId })

    if (error) {
        throw new Error(error.details[0].message);
    }

    try {
        const deletedAuthorList = await prisma.authorList.delete({
            where: {
                authorId_listId: {
                    authorId,
                    listId
                }
            }
        });

        return deletedAuthorList;
    } catch (error) {
        console.error("Error removing author list:", error);
        throw new Error("Could not remove author from list.");
    }
}

// Get authors of list

export const getAuthorsOfList = async (listId) => {

    // Validate input

    const { error } = idSchema.validate(listId);

    if (error) {
        throw new Error(error.details[0].message);
    }

    try {
        const authorsOfList = await prisma.authorList.findMany({
            where: {
                listId
            },
            include: {
                author: true,
            }
        })

        return authorsOfList;
    } catch (error) {
        console.error("Error getting authors of list:", error);
        throw new Error("Could not get authors of list.");
    }
}

// Get lists of author

export const getListsOfAuthor = async (authorId) => {

    // Validate input

    const { error } = idSchema.validate(authorId);

    if (error) {
        throw new Error(error.details[0].message);
    }

    try {
        const listsOfAuthor = await prisma.authorList.findMany({
            where: {
                authorId
            },
            include: {
                list: true,
            }
        })

        return listsOfAuthor;
    } catch (error) {
        console.error("Error getting lists for author:", error);
        throw new Error("Could not get lists for author.");
    }
}
