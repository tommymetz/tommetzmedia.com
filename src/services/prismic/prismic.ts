import * as prismic from "@prismicio/client";

export const repositoryName = "tommetzmediallc";

export const prismicClient = prismic.createClient(repositoryName, {
  routes: [
    {
      type: "homepage",
      path: "/",
    },
  ],
});