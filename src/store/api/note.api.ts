import { baseQuery } from "@/lib/utils/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery,
  tagTypes: ["note"],
  endpoints: (builder) => ({
    // Endpoint to fetch all notes
    getNotes: builder.query({
      query: () => ({
        method: "GET",
        url: "/notes",
      }),
    }),

    // Endpoint to create a new note
    createNote: builder.mutation({
      query: ({ title, description }) => ({
        method: "POST",
        url: "/notes",
        body: { title, description },
      }),
    }),

    // Endpoint to update an existing note by ID
    updateNote: builder.mutation({
      query: ({ id, title, description }) => ({
        method: "POST",
        url: `/notes/${id}`,
        body: { title, description },
      }),
    }),

    // Endpoint to delete a note by ID
    deleteNote: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/notes/${id}`,
      }),
    }),
  }),
});

export const {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
