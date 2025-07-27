import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Task from "../models/task-model";
import { Button } from "@mui/joy";
import EditDialog from "./edit-dialog";
import FinishDialog from "./finish-dialog";

export default function TaksGrid({
  data,
  loading,
  refreshData,
}: {
  data: Task[];
  loading: boolean;
  refreshData: () => Promise<void>;
}) {
  const columns: GridColDef[] = [
    {
      field: "entered_id",
      headerName: "order number",
      align: "center",
      hideable: false,
      flex: 1,
    },
    { field: "stage", headerName: "Stage", align: "center", hideable: false },
    {
      field: "recieved",
      headerName: "Recieved",
      filterable: false,
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row["recieved"] == null) {
          return (
            <Button
              onClick={async () => {
                const current_time = new Date();
                const formatted_date = current_time.toISOString();
                const res = await fetch("/api/edit-task", {
                  method: "PUT",
                  body: JSON.stringify({
                    id: params.row["id"],
                    entered_id: params.row["entered_id"],
                    stage: params.row["stage"],
                    recieved: formatted_date,
                    finished: params.row["finished"],
                    quantity: params.row["quantity"],
                  }),
                });
                console.log("response :: ", res);
                await refreshData();
              }}
            >
              recieve
            </Button>
          );
        }
        return (
          <div style={{ color: "blue", fontWeight: "bold" }}>
            {params.row["recieved"]}
          </div>
        );
      },
    },
    {
      field: "Finished",
      headerName: "Finished",
      filterable: false,
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row["finished"] == null) {
          return (
            <FinishDialog
              id={params.row["id"]}
              entered_id={params.row["entered_id"]}
              stage={params.row["stage"]}
              recieced={params.row["recieved"]}
              refreshData={refreshData}
            />
          );
        }
        return (
          <div className="text-blue-600 font-bold">
            {params.row["recieved"]}
          </div>
        );
      },
    },
    {
      field: "time",
      headerName: "Time",
      hideable: false,
      disableColumnMenu: true,
      filterable: false,
      sortable: false,
      align: "center",
      flex: 1,
      renderCell: (params) => {
        console.log("finished", params.row["finished"]);
        console.log("finished type", typeof params.row["finished"]);
        if (
          params.row["recieved"] === null ||
          params.row["finished"] === null
        ) {
          return <div>-</div>;
        }

        const date1 = new Date(params.row["finished"]);
        const date2 = new Date(params.row["recieved"]);
        const totalMilliseconds = date1.getTime() - date2.getTime();
        const seconds = Math.floor(totalMilliseconds / 1000) % 60;
        const minutes = Math.floor(totalMilliseconds / (1000 * 60)) % 60;
        const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60)) % 24; // % 24 to get remaining hours after full days
        const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        return (
          <div style={{ color: "blue", fontWeight: "bold" }}>
            {days + " days " + hours + ":" + minutes + ":" + seconds}
          </div>
        );
      },
    },
    {
      field: "quatity",
      headerName: "Quantity",
      filterable: false,
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row["quantity"] == null) {
          return <div className="text-center">-</div>;
        }
        return (
          <div className="text-blue-600 font-bold">
            {params.row["quantity"]}
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      hideable: false,
      disableColumnMenu: true,
      filterable: false,
      sortable: false,
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <EditDialog
          id={params.row["id"]}
          entered_id_initial={params.row["entered_id"]}
          stage_initial={params.row["stage"]}
          recieved={params.row["recieved"]}
          finished={params.row["finished"]}
          quantity={params.row["quantity"]}
          refreshData={refreshData}
        />
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      filterable: false,
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.value == null) {
          return (
            <Button
              onClick={async () => {
                await fetch("/api/delete-task", {
                  method: "DELETE",
                  body: JSON.stringify({
                    id: params.row["id"],
                  }),
                });
                await refreshData();
              }}
            >
              delete
            </Button>
          );
        }
        return (
          <div style={{ color: "blue", fontWeight: "bold" }}>
            {params.value}
          </div>
        );
      },
    },
  ];

  const rows = data.map((item) => item.toJson());

  return <DataGrid loading={loading} rows={rows} columns={columns} />;
}
