import { createYoga, createSchema } from "graphql-yoga";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Models
import User from "./models/User";

const app = express();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
        type User {
          id: ID!
          name: String!
          email: String!
        }
        type Query {
          users: [User!]!
          hello: String!
        }

        type Mutation {
          register(name: String!, email: String!, password: String!): User!
          login(email: String!, password: String!): String! # Retorna un token
        }

        type Subscription {
          time: String!
        }
        `,
    resolvers: {
      Query: {
        hello: () => "Hello from GraphQL in a Bun WS",
        users: async () => {
          return await User.find({});
        },
      },
      Mutation: {
        register: async (_: any, { name, email, password }: any) => {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({ name, email, password: hashedPassword });
          await newUser.save();
          return newUser;
        },
        login: async (_: any, { email, password }: any) => {
          const user = await User.findOne({ email });
          if (!user) throw new Error("User not founded");
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error("Incorrect password");
          const token = jwt.sign({ id: user._id }, "your_secret");
        },
      },
      Subscription: {
        time: {
          subscribe: async function* () {
            while (true) {
              yield { time: new Date().toISOString() };
              await new Promise((res) => setTimeout(res, 1000));
            }
          },
        },
      },
    },
  }),
  graphqlEndpoint: "/graphql",
});

app.use("/graphql", yoga);

app.listen(3000, () => {
  console.log("Express server + Yoga en http://localhost:4000/graphql");
});
