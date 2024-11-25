import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "../api/application";
import { useFetch } from "../hooks/useFetch";
import { BarLoader } from "react-spinners";
import { ApplicationResponse } from "../types/relation.types";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    isLoading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch<ApplicationResponse[], { user_id: string }>(getApplications, {
    user_id: user!.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
