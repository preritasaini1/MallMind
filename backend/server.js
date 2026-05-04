import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log("✅ MongoDB Connected for GraphQL Server"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.warn("⚠️ Continuing in fallback mode...");
  });

app.get("/", (req, res) => {
  res.status(200).send("MallMind API running");
});

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  const PORT = 5000;

  app.listen(PORT, () => {
    console.log(
      `🚀 Mall-Mind GraphQL running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

// ⭐ Start server only when not testing
if (process.env.NODE_ENV !== "test") {
  startServer();
}

// ⭐ export express app for tests
export default app;