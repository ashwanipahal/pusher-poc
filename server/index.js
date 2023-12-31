// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './schema';
import pusher from './pusher'

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Same ApolloServer initialization as before, plus the drain plugin
// for our httpServer.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  '/graphql',
  cors(),
  // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
  bodyParser.json({ limit: '50mb' }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);
app.post("/pusher/user-auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // const token = req.headers.authorization
  
  // we can add custom token validation here to validate and fetch the user details 
  // req.headers.authorization to validate the user
  // user detail would look like below one
  const user = {
    user_id: "123",
    user_info: {
      name: "John Smith",
    }
  };
  const authResponse = pusher.authorizeChannel(socketId, channel, user);
  res.send(authResponse);
});

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);