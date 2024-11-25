import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useFetch } from "../hooks/useFetch";
import { deleteJob, savedJobs } from "../api/jobs";
import { useUser } from "@clerk/clerk-react";
import { JobQueryResponse } from "../types/relation.types";
import { Jobs, SavedJobs } from "../types/supabase.types";
import { BarLoader } from "react-spinners";

type JobCardProps = {
  job: JobQueryResponse;
  isMyJob?: boolean;
  savedInit?: boolean;
  onJobAction: () => void;
};

const JobCard = ({
  job,
  isMyJob = false,
  savedInit,
  onJobAction,
}: JobCardProps) => {
  const [saved, setSaved] = useState(savedInit ?? false);

  const { fn: saveFn, data: savedJob } = useFetch<
    SavedJobs[] | string,
    { alreadySavedJob: boolean },
    [{ job_id: number; user_id: string }]
  >(savedJobs, {
    alreadySavedJob: saved,
  });

  const { user } = useUser();

  const { isLoading: loadingDeleteJob, fn: fnDeleteJob } = useFetch<
    Jobs,
    { job_id: number }
  >(deleteJob, {
    job_id: job.id,
  });

  const handleSavedJobs = async () => {
    if (user?.id) {
      await saveFn({
        job_id: job.id,
        user_id: user?.id,
      });
    }
    onJobAction();
  };
  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined && savedJob !== null) {
      setSaved(savedJob?.length > 0);
    }
  }, [savedJob]);

  return (
    <Card>
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
        <CardContent className="px-0">
          <div className="flex justify-between">
            {job.company && job.company.logo_url && (
              <img src={job.company.logo_url} className="h-6" />
            )}
            <div className="flex items-center gap-2">
              <MapPinIcon size={15} /> {job.location}
            </div>
          </div>
          <hr />
          {job.description}
        </CardContent>
        <CardFooter className="flex gap-2 px-0">
          <Link to={`/job/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              More Details
            </Button>
          </Link>
          {!isMyJob && (
            <Button onClick={handleSavedJobs} variant="outline">
              {saved ? (
                <Heart size={20} color="red" fill="red" />
              ) : (
                <Heart size={20} />
              )}
            </Button>
          )}
        </CardFooter>
      </CardHeader>
    </Card>
  );
};

export default JobCard;
