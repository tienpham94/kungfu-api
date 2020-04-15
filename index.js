const { ApolloServer, gql } = require("apollo-server");
const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

// gql`` parses your string into AST
const typeDefs = gql`
  fragment Meta on Movie {
    releaseDate
    rating
  }

  scalar Date

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
    releaseDate: Date
    rating: Int
    status: Status
    actor: [Actor]
    # FKiat, Boolean
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }

  input ActorInput {
    id: ID
  }

  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actor: [ActorInput]
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
  }
`;

const actors = [
  {
    id: "gordon",
    name: "Gordon Liu"
  }
];

const movies = [
  {
    id: "dasf",
    title: "5 Deadly Venoms",
    releaseDate: new Date("10-10-1983"),
    rating: 5
  },
  {
    id: "asfsf",
    title: "36th Chamber",
    releaseDate: new Date("10-10-1983"),
    rating: 5,
    actor: [{ id: "gordon" }]
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
  },
  Movie: {
    actor: (obj, arg, context) => {
      console.log(obj);
      const actorIds = obj.actor.map(a => a.id);
      return actors.filter(actor => actorIds.includes(actor.id));
    }
  },
  Mutation: {
    addMovie: (obj, { movie }, { userId }) => {
      if (userId) {
        const newMoviesList = [...movies, movie];
        return newMoviesList;
      }
      return movies;
    }
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "it's a date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
  context: ({ req }) => {
    const fakeUser = {
      userId: "hello"
    };
    return fakeUser;
  }
});

server.listen().then(({ url }) => console.log(`server started at ${url}`));
