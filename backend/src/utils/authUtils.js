/**
 * Normalizes the user provider to ensure legacy users are treated as 'local'.
 * @param {Object} user - The user object from the database.
 * @returns {string} - The normalized provider ('local' or 'google').
 */
const normalizeProvider = (user) => {
    if (!user) return null;
    return user.provider || 'local';
};

module.exports = {
    normalizeProvider,
};
