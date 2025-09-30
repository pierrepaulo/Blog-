import { RequestHandler } from "express";
import { getPostBySlug, getPublishedPosts } from "../services/post";
import { coverToUrl } from "../utils/cover-to-url";

export const getAllPosts: RequestHandler = async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page as string);
    if (page <= 0) {
      res.json({ error: "Pagina inexistente" });
      return;
    }
  }

  let posts = await getPublishedPosts(page);

  const postsToReturn = posts.map((post) => ({
    id: post.id,
    status: post.status,
    title: post.title,
    createdAt: post.createdAt,
    cover: coverToUrl(post.cover),
    authorName: post.author?.name,
    tags: post.tags,
    slug: post.slug,
  }));

  res.json({ posts: postsToReturn, page });
};

export const getPosts: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  const post = await getPostBySlug(slug);
  if (!post || (post && post.status !== "PUBLISHED")) {
    res.json({ error: "Post inexistente" });
    return;
  }

  res.json({
    post: {
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      cover: coverToUrl(post.cover),
      authorName: post.author?.name,
      tags: post.tags,
      body: post.body,
      slug: post.slug,
    },
  });
};

export const getRelatedPosts: RequestHandler = async (req, res) => {};
