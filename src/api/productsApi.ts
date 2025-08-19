import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product } from "../models/Product";
import type { CommentModel } from "../models/Comment";

const BASE_URL = "http://localhost:3001";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Products", "Product", "Comments"],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<
      Product[],
      { sortBy?: "name" | "count"; order?: "asc" | "desc" } | void
    >({
      query: (args) => {
        const sortBy = args?.sortBy ?? "name";
        const order = args?.order ?? "asc";
        const params =
          sortBy === "name"
            ? `_sort=name,count&_order=asc,asc`
            : `_sort=count,name&_order=${order},asc`;

        return `/products?${params}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Products" as const, id: "LIST" },
            ]
          : [{ type: "Products" as const, id: "LIST" }],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),

    addProduct: builder.mutation<Product, Omit<Product, "id">>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation<Product, Product>({
      query: (body) => ({
        url: `/products/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Product", id: arg.id },
        { type: "Products", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // Comments
    getCommentsByProduct: builder.query<CommentModel[], number>({
      query: (productId) =>
        `/comments?productId=${productId}&_sort=id&_order=desc`,
      providesTags: (_res, _err, productId) => [
        { type: "Comments", id: `PRODUCT_${productId}` },
      ],
    }),

    addComment: builder.mutation<CommentModel, Omit<CommentModel, "id">>({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, body) => [
        { type: "Comments", id: `PRODUCT_${body.productId}` },
        { type: "Product", id: body.productId }, 
      ],
    }),

    deleteComment: builder.mutation<
      { success: boolean; id: number },
      { id: number; productId: number }
    >({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Comments", id: `PRODUCT_${arg.productId}` },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCommentsByProductQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = productsApi;
