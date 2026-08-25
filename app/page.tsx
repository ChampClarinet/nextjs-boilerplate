"use server";

import { RedirectType, redirect } from "next/navigation";

const RootPage = async () => {
  const isLoggedIn = true; //TODO should add logic later
  if (isLoggedIn) redirect("/home", RedirectType.replace);

  redirect("/login", RedirectType.replace);
};

export default RootPage;
