import { graphql, HttpResponse } from "msw";

const mockListCartItemsWithProduct = {
  data: {
    listCartItems: {
      items: [
        {
          __typename: "CartItem",
          id: "1",
          sessionId: "session1",
          productId: "product1",
          quantity: 2,
          createdAt: "2021-09-01T00:00:00.000Z",
          updatedAt: "2021-09-01T00:00:00.000Z",
          product: {
            __typename: "Product",
            id: "product1",
            name: "Product 1",
            description: "This is product 1",
            price: 100,
            isArchived: false,
            image: "https://example.com/product1.jpg",
            stripePriceId: "stripePrice1",
            stripeProductId: "stripeProduct1",
            createdAt: "2021-09-01T00:00:00.000Z",
            updatedAt: "2021-09-01T00:00:00.000Z",
            owner: "owner1",
          },
          productCartItemsId: "productCartItemsId1",
          sessionCartItemsId: "sessionCartItemsId1",
        },
        {
          __typename: "CartItem",
          id: "2",
          sessionId: "session2",
          productId: "product2",
          quantity: 3,
          createdAt: "2021-09-01T00:00:00.000Z",
          updatedAt: "2021-09-01T00:00:00.000Z",
          product: {
            __typename: "Product",
            id: "product2",
            name: "Product 2",
            description: "This is product 2",
            price: 200,
            isArchived: false,
            image: "https://example.com/product2.jpg",
            stripePriceId: "stripePrice2",
            stripeProductId: "stripeProduct2",
            createdAt: "2021-09-01T00:00:00.000Z",
            updatedAt: "2021-09-01T00:00:00.000Z",
            owner: "owner2",
          },
          productCartItemsId: "productCartItemsId2",
          sessionCartItemsId: "sessionCartItemsId2",
        },
      ],
      nextToken: null,
    },
  },
};

export const handlers = [
  graphql.query("listCartItemsWithProduct", () => {
    return HttpResponse.json({
      data: mockListCartItemsWithProduct,
    });
  }),
  graphql.mutation("createCartItem", ({ query, variables }) => {
    console.log(
      "Intercepted a request for createCartItem GraphQL mutation: ",
      query,
      variables
    );
  }),
];
