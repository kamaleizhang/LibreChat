const mongoose = require('mongoose');
const userSchema = require('~/models/schema/userSchema');

const User = mongoose.model('User', userSchema);

/**
 * Retrieves users matching a given filter, sorted by the most recently updated.
 * @param {Object} filter - The filter criteria to apply.
 * @param {Object} [_sortOptions] - Optional sort parameters.
 * @returns {Promise<Array<MongoFile>>} A promise that resolves to an array of file documents.
 */
const findUsers = async (filter, _sortOptions) => {
  const sortOptions = { updatedAt: -1, ..._sortOptions };
  return await User.find(filter).sort(sortOptions).lean();
};

module.exports = User;
