"use client";

import Input from "@mui/joy/Input";
import { useEffect, useState } from "react";
import FormLabel from "@mui/joy/FormLabel";
import { Button, IconButton } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import TasksGrid from "./components/tasks-grid";
import Task from "./models/task-model";

export default function Page() {
  const idregex = new RegExp("[0-9]");
  const [isValid, setIsValid] = useState(false);
  const [stages, setStages] = useState([""]);
  const [task_id, setTask_id] = useState("");
  const [data, setData] = useState<Task[]>([]);
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    setisloading(true);
    async function fetchData() {
      const res = await fetch("/api/get-tasks");
      const clientData = await res.json();
      const newData: Task[] = [];
      for (let i = 0; i < clientData.length; i++) {
        newData.push(new Task(clientData[i]));
      }
      setData(newData);
    }
    fetchData();
    setisloading(false);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl mb-4">production line tracking</h1>
      <div className="flex">
        <FormLabel sx={{ fontSize: "16px" }}>Order number:</FormLabel>
        <Input
          className="ml-8"
          placeholder="#9999"
          error={!isValid}
          required
          value={task_id}
          onChange={(e) => {
            setIsValid(idregex.test(e.target.value));
            setTask_id(e.target.value);
          }}
        />
      </div>
      <div className="my-8">
        Stages:
        <div className="flex flex-wrap">
          {Array.from({ length: stages.length }).map((_, index) => {
            if (index != 0)
              return (
                <div key={index} className="relative mx-4 my-4">
                  <IconButton
                    sx={{
                      position: "absolute",
                      backgroundColor: "red",
                      color: "white",
                      right: 0,
                      top: "-50%",
                      zIndex: 10,
                    }}
                    size="sm"
                    onClick={() => {
                      const newStages = stages.filter(
                        (_, buttonIndex) => index != buttonIndex
                      );
                      setStages(newStages);
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Input
                    key={index}
                    placeholder={`stage ${index + 1}`}
                    value={stages[index]}
                    onChange={(e) => {
                      setStages((prev) =>
                        prev.map((item, inputIndex) =>
                          inputIndex === index ? e.target.value : item
                        )
                      );
                    }}
                  />
                </div>
              );
            return (
              <Input
                key={index}
                className="m-4"
                placeholder={`stage ${index + 1}`}
                value={stages[index]}
                onChange={(e) => {
                  setStages((prev) =>
                    prev.map((item, inputIndex) =>
                      inputIndex === index ? e.target.value : item
                    )
                  );
                }}
              />
            );
          })}
          <IconButton
            className="h-10 w-10 self-center"
            onClick={() => {
              const newStages = [...stages, ""];
              setStages(newStages);
            }}
            sx={{
              backgroundColor: "#0B6BCB",
              color: "white",
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <Button
        sx={{ marginBottom: "16px" }}
        disabled={!isValid || stages[0] === ""}
        onClick={async () => {
          for (let i = 0; i < stages.length; i++) {
            console.log("entered_id", task_id, "stage", stages[i]);
            await fetch("/api/add-task", {
              method: "POST",
              body: JSON.stringify({
                entered_id: task_id,
                stage: stages[i],
              }),
            });
          }
          const res = await fetch("/api/get-tasks");
          const clientData = await res.json();
          const newData: Task[] = [];
          for (let i = 0; i < clientData.length; i++) {
            newData.push(new Task(clientData[i]));
          }
          setStages([""]);
          setTask_id("");
          setData(newData);
        }}
      >
        Add pipeline
      </Button>

      <TasksGrid
        loading={isloading}
        data={data}
        refreshData={async () => {
          setisloading(true);
          const res = await fetch("/api/get-tasks");
          const clientData = await res.json();
          const newData: Task[] = [];
          for (let i = 0; i < clientData.length; i++) {
            newData.push(new Task(clientData[i]));
          }
          setData(newData);
          setisloading(false);
        }}
      />
    </div>
  );
}
