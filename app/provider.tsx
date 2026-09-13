"use client";

import React, { useEffect, useState } from "react";
import Header from "./_components/header";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const createUser = useMutation(api.user.CreateNewUser);

  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    const saveUser = async () => {
      const result = await createUser({
        email: user.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
        name: user.fullName ?? "",
      });

      setUserDetail(result as UserDetail);
    };

    saveUser();
  }, [user, createUser]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        <Header />
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
