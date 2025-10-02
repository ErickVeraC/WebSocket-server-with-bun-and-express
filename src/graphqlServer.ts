import { createYoga, createSchema } from "graphql-yoga";
import express from "express";

const app = express();

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
        type Query {
            hello: String!
        }
        type Subcription {
            time: String!
        }
        `,
    resolvers: {
      Query: {
        hello: () => "Hello from GraphQL in a Bun WS",
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

app.listen(4000, () => {
  console.log("Express server + Yoga en http://localhost:4000/graphql");
});
