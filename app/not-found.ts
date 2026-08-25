"use server";

import { RedirectType, redirect } from "next/navigation";

const NotFoundPage = async () => {
  redirect("/", RedirectType.replace);
};

export default NotFoundPage;
