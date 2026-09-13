import { createContext, useContext } from "react";

export type UserDetail = {
  _id?: string;
  name: string;
  imageUrl: string;
  email: string;
  subscription?: string;
};

type UserDetailContextValue = {
  userDetail: UserDetail | null;
  setUserDetail: (user: UserDetail | null) => void;
};

export const UserDetailContext = createContext<UserDetailContextValue>({
  userDetail: null,
  setUserDetail: () => {},
});

export const useUserDetail = () => {
  return useContext(UserDetailContext);
};
