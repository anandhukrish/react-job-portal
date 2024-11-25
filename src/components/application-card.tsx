import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "../api/application";
import { useFetch } from "../hooks/useFetch";
import { BarLoader } from "react-spinners";
import { Application, StatusEnum } from "../types/supabase.types";
import { ApplicationResponse } from "../types/relation.types";

type ApplicationCardProps = {
  application: ApplicationResponse;
  isCandidate?: boolean;
};

const ApplicationCard = ({
  application,
  isCandidate = false,
}: ApplicationCardProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume ?? "";
    link.target = "_blank";
    link.click();
  };

  const { isLoading: loadingHiringStatus, fn: fnHiringStatus } = useFetch<
    Application,
    { job_id: number },
    [status: StatusEnum]
  >(updateApplicationStatus, {
    job_id: application.job!,
  });

  const handleStatusChange = (status: StatusEnum) => {
    //@ts-expect-error-ignore
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  console.log(application);

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job_details?.title} at ${application?.job_details?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status as StatusEnum}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
