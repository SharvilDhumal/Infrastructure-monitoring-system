const normalizeProvider = (user) => {
  if (!user) return null;
  if (user.provider) return user.provider;
  // Fallback for legacy users or unexpected data structure
  if (user.googleId) return 'google';
  return 'local';
};

module.exports = {
  normalizeProvider
};
