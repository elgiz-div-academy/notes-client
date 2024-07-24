import { baseQuery } from "@/lib/utils/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { AuthActions } from "../slice/auth.slice";
import { useDispatch } from "react-redux";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        method: "POST",
        url: "/auth/login",
        body: credentials,
      }),
    }),
  }),
});

export const AuthApiHooks = {
  useLogin: () => {
    const dispatch = useDispatch();
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const loginUser = async (credentials: any) => {
      try {
        const data = await login(credentials).unwrap();
        dispatch(AuthActions.set({ token: data.token, user: data.user }));
        return data;
      } catch (err) {
        console.error("Failed to login:", err);
        throw err;
      }
    };

    return { login: loginUser, isLoading, isError, error };
  },
};

export const { useLoginMutation } = authApi;
