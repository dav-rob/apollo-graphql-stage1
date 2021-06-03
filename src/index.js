const { ApolloServer, gql } = require("apollo-server");
const DataLoader = require("dataloader");

const genPromise = (value, text) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(text);
      return resolve(value);
    }, 100);
  });

const postModel = (() => {
  const posts = [
    { id: 1, userId: 1, title: "Hello World by user A" },
    { id: 2, userId: 1, title: "GraphQL Forever by user A" },
    { id: 3, userId: 2, title: "Apollo So Cool by user B" },
    { id: 4, userId: 4, title: "Sandbox rules by user D" },
    { id: 5, userId: 3, title: "DataLoader Example by user C" }
  ];
  return {
    getPostById: (id) =>
      genPromise(
        posts.find((post) => post.id === id),
        `getPostById: ${id}`
      ),
    getPostsByUserId: (userId) =>
      genPromise(
        posts.filter((post) => post.userId === userId),
        `getPostsByUserId: ${userId}`
      ),
    getPostsByUserIds: (userIds) =>
      genPromise(
        posts.filter((post) => userIds.includes(post.userId)),
        `getPostsByUserId: ${userIds}`
      )
  };
})();

const userModel = (() => {
  const users = [
    { pid: 1, name: "A", bestFriendId: 2, key: "hello1", followingUserIds: [2, 3, 4] },
    { pid: 2, name: "B", bestFriendId: 1, key: "hello2", followingUserIds: [1, 3, 4, 5] },
    { pid: 3, name: "C", bestFriendId: 4, key: "hello3", followingUserIds: [1, 2, 5] },
    { pid: 4, name: "D", bestFriendId: 5, key: "hello4", followingUserIds: [1, 2, 5] },
    { pid: 5, name: "E", bestFriendId: 4, key: "hello5", followingUserIds: [2, 3, 4] }
  ];

  return {
    getUserById: (id) =>
      genPromise(
        users.find((user) => user.pid === id),
        `getUserById: ${id}`
      ),
    getUserByName: (name) =>
      genPromise(
        users.find((user) => user.name === name),
        `getUserByName: ${name}`
      ),
    getUsersByIds: (ids) =>
      genPromise(
        users.filter((user) => ids.includes(user.pid)),
        `getUsersByIds: ${ids}`
      ),
    getAllUsers: () => genPromise(users, "getAllUsers *")
  };
})();

const typeDefs = gql`
  type Query {
    testString: String
    user(name: String!): User
    allUsers: [User]
  }

  type User {
    id: Int
    name: String
    bestFriend: User
    followingUsers: [User]
    posts: [Post]
  }

  type Post {
    id: Int
    title: String
  }
`;

const resolvers = {
  Query: {
    user(root, { name }, { userModel }) {
      return userModel.getUserByName(name);
    },
    allUsers(root, args, { userModel }) {
      return userModel.getAllUsers();
    }
  },
  User: {
    //id: root => root.pid || root._pid,
    async id (parent, args, context, info) {
      console.log(`user id = ${parent.pid}`);
      return parent.pid;
    },
    async followingUsers(user, args, { dataloaders }) {
      const users = await dataloaders.users.loadMany(user.followingUserIds);
      console.log(
        user.pid,
        user.followingUserIds,
        users.map((user) => user.pid)
      );
      // return userModel.getUsersByIds(user.followingUserIds)
      return users;
    },
    async bestFriend(user, args, { dataloaders }) {
      const bestFriend = await dataloaders.users.load(user.bestFriendId);
      console.log(user.pid, user.bestFriendId, bestFriend.pid, bestFriend.key);
      return bestFriend;
      // return userModel.getUserById(user.bestFriendId)
    },
    async posts(user, args, { dataloaders, postModel }) {
      const posts = await dataloaders.posts.load(user.pid);
      console.log(user.pid, posts);
      return posts;
      // return postModel.getPostsByUserId(user.pid)
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: async ({ req }) => {
    return {
      userModel,
      postModel,
      dataloaders: {
        users: new DataLoader(async (userIds) => {
          const users = await userModel.getUsersByIds(userIds);
          return userIds.map((userId) =>
            users.find((user) => user.pid === userId)
          );
        }),
        posts: new DataLoader(async (userIds) => {
          const posts = await postModel.getPostsByUserIds(userIds);
          return userIds.map((userId) =>
            posts.filter((post) => post.userId === userId)
          );
        })
      }
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
