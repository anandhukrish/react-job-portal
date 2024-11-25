import { useEffect } from "react";
import { useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { getSingleJob, updateJobHiringStatus } from "../api/jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Briefcase, DoorClosed, DoorOpen, MapIcon } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import { Select, SelectContent, SelectTrigger } from "../components/ui/select";
import { SelectItem, SelectValue } from "@radix-ui/react-select";
import { cn } from "../lib/utils";
import ApplyJobDrawer from "../components/apply-job-drawer";
import { SingleJobQueryResponse } from "../types/relation.types";
import ApplicationCard from "../components/application-card";
import { Jobs } from "../types/supabase.types";

const Job = () => {
  const { id } = useParams();

  const {
    data: job,
    fn: singleJobFn,
    error: singleJobError,
    isLoading: singleJobLoading,
  } = useFetch<SingleJobQueryResponse, { job_id: number }>(getSingleJob, {
    job_id: Number(id!),
  });

  const { fn: updteJobStatusFn, error: updateJobError } = useFetch<
    Jobs,
    { job_id: number },
    [isOpen: boolean]
  >(updateJobHiringStatus, { job_id: Number(id) });

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) singleJobFn();
  }, [isLoaded]);

  const handleStatusChange = (value: string) => {
    const isOpen = value === "open" ? true : false;
    updteJobStatusFn(isOpen).then(() => singleJobFn());
  };

  if (!isLoaded || singleJobLoading)
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;

  if (singleJobError || updateJobError)
    return <div>{singleJobError ? singleJobError : updateJobError}</div>;

  return (
    <div>
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="text-4xl sm:text-6xl">{job?.title}</h1>

        <img
          src={job?.company?.logo_url ?? ""}
          alt={job?.company?.name ?? ""}
          className="h-12"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {job?.applications?.length}
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>
      {/* hiring position */}

      {job?.recuirter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={cn(
              "w-full",
              job?.isOpen ? "bg-green-500" : "bg-red-500"
            )}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                job?.isOpen ? "(Open)" : "(Closed)"
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements ?? ""}
        className="bg-transparent sm:text-lg"
      />

      {job?.recuirter_id !== user?.id && (
        <ApplyJobDrawer
          job={job!}
          user={user}
          fetchJob={singleJobFn}
          applied={
            !!job?.applications?.find((ap) => ap?.candidate_id === user?.id)
          }
        />
      )}
      {job?.applications &&
        job.applications.length > 0 &&
        job?.recuirter_id === user?.id && (
          <div className="flex flex-col gap-2">
            <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
            {job?.applications.map((application) => {
              return (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              );
            })}
          </div>
        )}
    </div>
  );
};

export default Job;
