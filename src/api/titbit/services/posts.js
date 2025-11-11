"use strict";

/**
 * Posts service for titbits
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 */

const POSTS_PAGE_SIZE = 20;
const DEFAULT_PAGE = 1;

/**
 * Posts service factory
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Service methods.
 */
const createPostsService = ({ strapi }) => ({
  /**
   * Fetch all titbits posts ordered by recently uploaded with pagination.
   * Fully SQL-based for maximum performance.
   * @param {number} page - Page number (default: 1)
   * @param {number|null} userId - Optional user ID to check if posts are liked by user
   * @returns {Promise<Object>} Paginated titbits posts with like counts and isLiked status
   */
  async getTitbitsPosts(page = DEFAULT_PAGE, userId = null) {
    const pageNum = parseInt(page.toString(), 10);
    const offset = (pageNum - 1) * POSTS_PAGE_SIZE;

    // Run count and titbits queries in parallel for better performance
    const [totalCountResult, titbits] = await Promise.all([
      // Get total count for pagination
      strapi.db.connection
        .count("* as total")
        .from("titbits")
        .whereNotNull("published_at")
        .first(),
      // Fetch titbits with raw SQL - optimized single query
      strapi.db.connection
        .select("t.id", "t.caption", "t.tags", "t.source", "t.description")
        .from("titbits as t")
        .whereNotNull("t.published_at")
        .orderBy("t.created_at", "desc")
        .limit(POSTS_PAGE_SIZE)
        .offset(offset),
    ]);

    const total = parseInt(totalCountResult?.total || "0", 10);
    const pageCount = Math.ceil(total / POSTS_PAGE_SIZE);

    if (titbits.length === 0) {
      return {
        data: [],
        pagination: {
          page: pageNum,
          pageSize: POSTS_PAGE_SIZE,
          pageCount: 0,
          total: 0,
        },
      };
    }

    const titbitIds = titbits.map((t) => t.id);

    // Run all dependent queries in parallel for maximum performance
    const queries = [
      // Fetch like counts in a single optimized query
      strapi.db.connection
        .select("content_id")
        .count("* as count")
        .from("likes")
        .where("type", "titbit")
        .whereIn("content_id", titbitIds)
        .groupBy("content_id"),
      // Fetch media files for all titbits in a single query
      strapi.db.connection
        .select(
          "frm.related_id as titbit_id",
          "f.id",
          "f.url",
          "f.name",
          "f.width",
          "f.height",
          "f.caption",
          "f.alternative_text as alternativeText"
        )
        .from("files_related_morphs as frm")
        .innerJoin("files as f", "frm.file_id", "f.id")
        .where("frm.related_type", "api::titbit.titbit")
        .whereIn("frm.related_id", titbitIds)
        .orderBy("frm.order", "asc"),
    ];

    // Add user likes query only if userId is provided
    if (userId && titbitIds.length > 0) {
      queries.push(
        strapi.db.connection
          .select("content_id")
          .from("likes")
          .where("type", "titbit")
          .where("user_id", userId)
          .whereIn("content_id", titbitIds)
      );
    }

    // Execute all queries in parallel
    const results = await Promise.all(queries);
    const likeCounts = results[0];
    const mediaFiles = results[1];
    const userLikes = userId ? results[2] : [];

    // Build like counts map
    const likeCountsMap = {};
    likeCounts.forEach((row) => {
      const contentId = row.content_id?.toString() || row.content_id;
      likeCountsMap[contentId] = parseInt(row.count, 10) || 0;
    });

    // Build user liked posts map
    const userLikedPostsMap = {};
    if (userId && userLikes) {
      userLikes.forEach((like) => {
        const contentId = like.content_id?.toString() || like.content_id;
        userLikedPostsMap[contentId] = true;
      });
    }

    // Group media by titbit_id
    const mediaMap = {};
    mediaFiles.forEach((file) => {
      const titbitId = file.titbit_id?.toString() || file.titbit_id;
      if (!mediaMap[titbitId]) {
        mediaMap[titbitId] = [];
      }
      mediaMap[titbitId].push({
        id: file.id,
        url: file.url,
        name: file.name,
        width: file.width,
        height: file.height,
        caption: file.caption,
        alternativeText: file.alternativeText,
      });
    });

    // Combine all data - only return requested fields
    const titbitsWithLikes = titbits.map((titbit) => {
      const titbitId = titbit.id?.toString() || titbit.id;
      return {
        caption: titbit.caption,
        tags: titbit.tags,
        source: titbit.source,
        description: titbit.description,
        likeCount: likeCountsMap[titbitId] || 0,
        isLiked: userId ? userLikedPostsMap[titbitId] || false : false,
        media: mediaMap[titbitId] || [],
      };
    });

    return {
      data: titbitsWithLikes,
      pagination: {
        page: pageNum,
        pageSize: POSTS_PAGE_SIZE,
        pageCount,
        total,
      },
    };
  },

  /**
   * Fetch a specific titbit post by ID with like count and media.
   * Fully SQL-based for maximum performance.
   * @param {number} postId - Post ID
   * @param {number|null} userId - Optional user ID to check if post is liked by user
   * @returns {Promise<Object|null>} Titbit post with like count and isLiked status, or null if not found
   */
  async getTitbitPost(postId, userId = null) {
    // Fetch titbit with raw SQL
    const titbit = await strapi.db.connection
      .select("t.id", "t.caption", "t.tags", "t.source", "t.description")
      .from("titbits as t")
      .where("t.id", postId)
      .whereNotNull("t.published_at")
      .first();

    if (!titbit) {
      return null;
    }

    const titbitId = titbit.id;

    // Run all dependent queries in parallel for maximum performance
    const queries = [
      // Fetch like count in a single optimized query
      strapi.db.connection
        .select("content_id")
        .count("* as count")
        .from("likes")
        .where("type", "titbit")
        .where("content_id", titbitId)
        .groupBy("content_id")
        .first(),
      // Fetch media files for the titbit in a single query
      strapi.db.connection
        .select(
          "frm.related_id as titbit_id",
          "f.id",
          "f.url",
          "f.name",
          "f.width",
          "f.height",
          "f.caption",
          "f.alternative_text as alternativeText"
        )
        .from("files_related_morphs as frm")
        .innerJoin("files as f", "frm.file_id", "f.id")
        .where("frm.related_type", "api::titbit.titbit")
        .where("frm.related_id", titbitId)
        .orderBy("frm.order", "asc"),
    ];

    // Add user like query only if userId is provided
    if (userId) {
      queries.push(
        strapi.db.connection
          .select("content_id")
          .from("likes")
          .where("type", "titbit")
          .where("user_id", userId)
          .where("content_id", titbitId)
          .first()
      );
    }

    // Execute all queries in parallel
    const results = await Promise.all(queries);
    const likeCount = results[0];
    const mediaFiles = results[1];
    const userLike = userId ? results[2] : null;

    // Get like count
    const likeCountValue = likeCount ? parseInt(likeCount.count, 10) || 0 : 0;

    // Check if user liked the post
    const isLiked = userId ? (userLike ? true : false) : false;

    // Format media files
    const media = mediaFiles.map((file) => ({
      id: file.id,
      url: file.url,
      name: file.name,
      width: file.width,
      height: file.height,
      caption: file.caption,
      alternativeText: file.alternativeText,
    }));

    // Return in same structure as posts list
    return {
      caption: titbit.caption,
      tags: titbit.tags,
      source: titbit.source,
      description: titbit.description,
      likeCount: likeCountValue,
      isLiked,
      media,
    };
  },
});

module.exports = createPostsService;
