import { useUser } from "@clerk/clerk-react";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { pathname } = useLocation();

  console.log(user);

  if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
    return <Navigate to="/?sign-in=true" />;
  }

  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
