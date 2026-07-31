import { fetchUserProfile } from './githubService';

/**
 * @typedef {object} Profile
 * @property {string} name
 * @property {string} avatar
 * @property {string|null} bio
 * @property {string|null} company
 * @property {string|null} blog
 * @property {string|null} location
 * @property {number} followers
 * @property {number} following
 * @property {number} publicRepos
 * @property {number} publicGists
 * @property {string} createdAt
 * @property {string} profileUrl
 * @property {string|null} twitter
 */

/**
 * Fetches the GitHub user profile and transforms it into a clean Profile
 * object suitable for the UI.
 *
 * @returns {Promise<Profile>}
 * @throws {Error} When the underlying GitHub request fails.
 */
export async function getProfile() {
  const user = await fetchUserProfile();

  return normaliseProfile(user);
}

/**
 * Transforms a raw GitHub API user response into the application's Profile
 * model.
 *
 * Separated from `getProfile` so it can be reused if the user data comes
 * from a different source in the future (e.g. a cached local copy).
 *
 * @private
 * @param {import('./githubService').GitHubUser} user
 * @returns {Profile}
 */
function normaliseProfile(user) {
  return {
    name: user.name || user.login,
    avatar: user.avatar_url,
    bio: user.bio,
    company: user.company,
    blog: user.blog,
    location: user.location,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    createdAt: user.created_at,
    profileUrl: user.html_url,
    twitter: user.twitter_username,
  };
}
