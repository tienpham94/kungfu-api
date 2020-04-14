const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID!
    name: String!
  }

  type Movie {
    id: ID!
    title: String
    releaseDate: String
    rating: Int
    status: Status
    actor: [Actor]
    # FKiat, Boolean
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
`;

const movies = [
  {
    id: "dasf",
    title: "5 Deadly Venoms",
    releaseDate: "10-10-1983",
    rating: 5
  },
  {
    id: "asfsf",
    title: "36th Chamber",
    releaseDate: "10-10-1983",
    rating: 5,
    actor: [{ id: "asfasfd", name: "Gordon Liu" }]
  }
];

const resolvers = {
  Query: {
    movies: () => {
      return movies;
    },
    movie: (obj, { id }, context, info) => {
      return movies.find(m => m.id === id);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));
