import { MiningDataAgent } from "../ai/agent.js";
import prisma from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";


export const getRedditPosts = async (req, res, next) => {
  try {
    const { query } = req.params;

    // pagination params from frontend
    const { after = null, limit = 5 } = req.query;

    let url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;

    // apply cursor pagination
    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    const posts = data?.data?.children || [];

    // ✅ CLEAN DATA
    const cleanedPosts = posts.map(p => ({
      title: p.data.title,
      text: p.data.selftext?.slice(0, 200) || "",
      subreddit: p.data.subreddit,
      author: p.data.author,
      upvotes: p.data.ups,
      comments: p.data.num_comments,
      url: `https://reddit.com${p.data.permalink}`
    }));

    // 🔥 OPTIONAL: send only top posts to AI (better performance)
    const topPosts = [...cleanedPosts]
      .sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments))
      .slice(0, 5);

    const aiResponse = await MiningDataAgent({
      query,
      posts: topPosts
    });

    res.status(200).json({
      success: true,

      posts: cleanedPosts,

      // 🔥 pagination info for frontend
      pagination: {
        after: data?.data?.after || null,
        before: data?.data?.before || null,
        hasMore: !!data?.data?.after
      },

      insights: aiResponse
    });

  } catch (error) {
    next(new ApiError(500, error.message));
  }
};