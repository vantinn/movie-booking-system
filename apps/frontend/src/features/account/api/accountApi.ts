import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/lib/store";
import { User } from "@/features/account/types/user";

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3000/api",
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        updateProfile: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: "/user/users/profile",
                method: "PUT",
                body,
            }),
        }),
    }),
});

export const { useUpdateProfileMutation } = accountApi;
