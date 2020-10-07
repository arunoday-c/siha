import React, { useState } from "react";
import {
  AlgaehDataGrid,
  AlgaehMessagePop,
  Spin,
} from "algaeh-react-components";
import { useQuery, useMutation } from "react-query";
import {
  addNurseNote,
  getNurseNotes,
  updateNurseNote,
  deleteNurseNote,
} from "./api";

export default function NursesNotes({
  viewOnly = false,
  patient_id = null,
  visit_id = null,
  visit_date = null,
  episode_id = null,
}) {
  const [input, setInput] = useState("");
  const [current, setCurrent] = useState(null);

  const { data: notes, isLoading: noteLoading, refetch } = useQuery(
    ["nurse-notes", { patient_id, visit_id, episode_id }],
    getNurseNotes,
    {
      initialData: [],
      initialStale: true,
      enabled: !!patient_id,
    }
  );

  const [addNote, { isLoading: addLoading }] = useMutation(addNurseNote, {
    onSuccess: () => {
      refetch();
      setCurrent(null);
      setInput("");
      AlgaehMessagePop({
        display: "Note added successfully",
        type: "success",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "success",
      });
    },
  });

  const [delNote, { isLoading: delLoading }] = useMutation(deleteNurseNote, {
    onSuccess: () => {
      refetch();
      setCurrent(null);
      setInput("");
      AlgaehMessagePop({
        display: "Note deleted successfully",
        type: "success",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "success",
      });
    },
  });

  const [updateNote, { isLoading: updLoading }] = useMutation(updateNurseNote, {
    onSuccess: () => {
      refetch();
      setCurrent(null);
      setInput("");
      AlgaehMessagePop({
        display: "Note Updated successfully",
        type: "success",
      });
    },
    onError: (err) => {
      AlgaehMessagePop({
        display: err?.message,
        type: "success",
      });
    },
  });

  const columns = [
    {
      fieldName: "nursing_notes",
      label: "Notes",
      disabled: true,
    },
    {
      fieldName: "created_date",
      label: "Entered by & Date",
      disabled: true,
    },
  ];

  if (!viewOnly) {
    columns.unshift({
      fieldName: "hims_f_nurse_notes_id",
      label: "Actions",
      displayTemplate: (row) => {
        return (
          <>
            <i
              className="fas fa-pen"
              onClick={() => {
                setCurrent(row);
                setInput(row?.nursing_notes);
              }}
            ></i>
            <i
              className="fas fa-trash-alt"
              onClick={() => {
                delNote({
                  hims_f_nurse_notes_id: row?.hims_f_nurse_notes_id,
                });
              }}
            ></i>
          </>
        );
      },
    });
  }

  return (
    <Spin spinning={noteLoading || addLoading || updLoading || delLoading}>
      <div>
        <div className="row">
          {!viewOnly && (
            <>
              <h6>Enter Nursing Notes</h6>
              <hr />{" "}
              <div className="col-12">
                <textarea
                  value={input}
                  name="nursing_notes"
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div className="col-12" style={{ textAlign: "right" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!current) {
                      addNote({
                        patient_id,
                        visit_id,
                        episode_id,
                        nursing_notes: input,
                        visit_date,
                      });
                    } else {
                      updateNote({
                        nursing_notes: input,
                        hims_f_nurse_notes_id: current?.hims_f_nurse_notes_id,
                      });
                    }
                  }}
                >
                  Add Notes
                </button>
              </div>
            </>
          )}
          <div className="col-12 patientNotesGrid_Cntr">
            <AlgaehDataGrid
              className="patientNotesGrid"
              columns={columns}
              rowUniqueId="hims_f_nurse_notes_id"
              data={notes}
              // isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}
