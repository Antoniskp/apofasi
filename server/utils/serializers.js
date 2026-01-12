/**
 * Data serializers for API responses
 */

import { serializeAuthor } from './validation.js';

/**
 * Serialize news item for API response
 * @param {Object} news - News document from database
 * @returns {Object} Serialized news object
 */
export const serializeNews = (news) => ({
  id: news.id,
  title: news.title,
  content: news.content,
  author: serializeAuthor(news.author),
  createdAt: news.createdAt,
  updatedAt: news.updatedAt,
});

/**
 * Serialize poll for API response
 * @param {Object} poll - Poll document from database
 * @param {Object} currentUser - Current authenticated user (optional)
 * @param {Object} session - Express session (optional)
 * @returns {Object} Serialized poll object
 */
export const serializePoll = (poll, currentUser, session) => {
  const totalVotes =
    poll.options?.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;
  
  const hasVoted = currentUser
    ? poll.votedUsers?.some((userId) => userId.toString() === currentUser.id)
    : false;
  
  const hasVotedAnonymously = poll.anonymousResponses
    ? session?.anonymousPollVotes?.includes(poll.id?.toString())
    : false;

  return {
    id: poll.id,
    question: poll.question,
    options: (poll.options || []).map((option) => ({
      id: option._id?.toString() || String(option.text),
      text: option.text,
      votes: option.votes || 0,
    })),
    tags: poll.tags || [],
    region: poll.region,
    cityOrVillage: poll.cityOrVillage,
    createdBy: poll.isAnonymousCreator ? null : serializeAuthor(poll.createdBy),
    isAnonymousCreator: Boolean(poll.isAnonymousCreator),
    anonymousResponses: Boolean(poll.anonymousResponses),
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
    totalVotes,
    hasVoted: hasVoted || hasVotedAnonymously,
  };
};
