const isProduction = process.env.NODE_ENV === "production";

const frappeURL = process.env.NEXT_PUBLIC_FRAPPE_API_URL;
if (!frappeURL) throw Error("no frappe url");

const AuthedPageLayout = async ({ children }: { children: React.ReactNode }) => {
  //? Authenticated logic should be here.

  if (!isProduction) {
    console.info("This is development mode, auth logic log data will be logged to console");
    //? implement here if any log you want
  }

  return children;
};

export default AuthedPageLayout;
