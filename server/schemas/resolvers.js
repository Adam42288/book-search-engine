const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

// resolvers
const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password');
                // returns everything but password
  
            return userData;
        }
      throw new AuthenticationError("Error: Invalid User. Please login or register");
    },
  },

  // mutation resolvers
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (_parent, { email, password }) => {
      const user = await user.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Error: Invalid User. Please login or register");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Error: Invalid User. Please login or register");
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_parent, { userId, bookData }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { savedBooks: { book: bookData } } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("Error: Invalid User. Please login or register");
    },

    // removeBook: async (_parent, { userId, bookId }, context) => {
    removeBook: async (_parent, { book }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError("Error: Invalid User. Please login or register");
    },
  },
};

module.exports = resolvers;