import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Session {
  token: string | null;
  user: any;
}
const initialState: Session = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<Session>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key as keyof Session] = value;
      });
    },
  },
});

export const AuthActions = {
  ...authSlice.actions,
};
