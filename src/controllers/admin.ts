import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import z from "zod";
import { createPost, createPostSlug, handleCover } from "../services/post";
import { getUserById } from "../services/user";
import { coverToUrl } from "../utils/cover-to-url";

export const addPost = async (req: ExtendedRequest, res: Response) => {
  if (!req.user) return;

  const schema = z.object({
    title: z.string(),
    tags: z.string(),
    body: z.string(),
  });
  const data = schema.safeParse(req.body);
  if (!data.success) {
    res.json({ error: data.error.flatten().fieldErrors });
    return;
  }

  if (!req.file) {
    res.json({ error: "Sem Arquivo" });
    return;
  }

  const coverName = await handleCover(req.file);
  if (!coverName) {
    res.json({ error: "Imagem nao permitida/enviada" });
    return;
  }

  const slug = await createPostSlug(data.data.title);

  const newPost = await createPost({
    authorId: req.user.id,
    slug,
    title: data.data.title,
    tags: data.data.tags,
    body: data.data.body,
    cover: coverName,
  });

  const author = await getUserById(newPost.authorId);

  res.status(201).json({
    post: {
      id: newPost.id,
      slug: newPost.slug,
      title: newPost.title,
      createdAt: newPost.createdAt,
      cover: coverToUrl(newPost.cover),
      tags: newPost.tags,
      authorName: author?.name,
    },
  });
};
