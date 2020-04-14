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
  }
`;

const movies = [
  { title: "5 Deadly Venoms", releaseDate: "10-10-1983", rating: 5 },
  {
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
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));
