import React, { useEffect } from "react";
import { fetchJobs } from "../api/jobs";
import { useUser } from "@clerk/clerk-react";
import { useFetch } from "../hooks/useFetch";
import { BarLoader } from "react-spinners";
import JobCard from "../components/job-card";
import { JobQueryResponse } from "../types/relation.types";

const JobListing = () => {
  const { isLoaded } = useUser();

  const {
    fn: getJobs,
    data: jobData,
    isLoading: isJobLoading,
  } = useFetch<JobQueryResponse[], { location: string }>(fetchJobs);

  useEffect(() => {
    if (isLoaded) getJobs();
  }, [isLoaded]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="gradient-text font-extrabold tracking-tighter text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>
      {isJobLoading && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isJobLoading === false &&
          jobData &&
          jobData.length > 0 &&
          jobData.map((job) => (
            <JobCard
              job={job}
              key={job.id}
              savedInit={job.saved.length > 0}
              isMyJob={false}
              onJobAction={getJobs}
            />
          ))}
      </div>
    </div>
  );
};

export default JobListing;
