const isProduction = process.env.NODE_ENV === "production";

const AuthedPageLayout = async ({ children }: { children: React.ReactNode }) => {
  //? Add the consuming application's authentication and authorization checks here.
  //* Keep this boundary provider-agnostic so projects can choose their own auth implementation.

  if (!isProduction) {
    //? Add development-only auth diagnostics here when a consuming project needs them.
  }

  return children;
};

export default AuthedPageLayout;
