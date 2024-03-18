import handler from 'express-async-handler';

export const createPost = handler(async (req, res) => {
  res.json({
    status: true,
    message: `Post is created successfully.`,
  });
});

export const updatePost = handler(async (req, res) => {
  res.json({ status: true, message: `Post is updated successfully.` });
});

export const deletePost = handler(async (req, res) => {
  res.json({ status: true, message: `Post is deleted successfully.` });
});

export const getPosts = handler(async (req, res) => {
  res.json({ status: true, message: `Posts are fetched successfully.` });
});
