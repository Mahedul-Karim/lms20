import React, { useEffect, useState } from "react";
import Input from "../../../ui/inputs/Input";
import { FiPlusCircle } from "react-icons/fi";
import Sections from "./Sections";
import CancelButton from "../CancelButton";
import FormButton from "../../../ui/inputs/FormButton";
import Label from "./inputs/Label";
import { useDispatch, useSelector } from "react-redux";
import {
  addSection,
  editSection,
  deleteSection,
  addNewCourse,
} from "../../../../store/slices/course";
import { toast } from "react-hot-toast";
import { useApi } from "../../../../hooks/useApi";
import SpinnerModal from "../../../ui/modal/SpinnerModal";

const CourseBuilder = ({ setActive, setIsEditing }) => {
  const [sectionName, setSectionName] = useState("");
  const [isSectionEditing, setIsSectionEditing] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState(null);

  const dispatch = useDispatch();

  const { newCourse } = useSelector((state) => state.course);

  const { mutate, isPending } = useApi({
    success: (data) => {
      toast.success(data.message);
      if (isSectionEditing) {
        dispatch(
          editSection({ index: sectionToEdit, name: data.section.sectionName })
        );
        setIsSectionEditing(false);
        setSectionToEdit(null);
        setSectionName("");
      } else {
        dispatch(addNewCourse(data.updatedCourse));
      }
    },
    error: (err) => {
      toast.error(err);
    },
  });

  useEffect(() => {
    if (isSectionEditing) {
      setSectionName(newCourse.courseContents[sectionToEdit].sectionName);
    }
  }, [isSectionEditing]);

  const onClick = () => {
    if (!sectionName) {
      return toast.error("Section Name is required!");
    }
    if (isSectionEditing) {
      const sectionId = newCourse.courseContents[sectionToEdit]._id;

      const options = {
        method: "PATCH",
        data: {
          sectionId,
          sectionName,
        },
      };

      mutate({ endpoint: "section", options });


      return;
    }

    const options = {
      method: "POST",
      data: {
        sectionName,
        courseId: newCourse._id,
      },
    };
    mutate({ endpoint: "section", options });
    setSectionName("");
  };

  const removeSection = (index) => {
    dispatch(deleteSection(index));
  };

  const nextForm = () => {
    if (
      newCourse.courseContents.length === 0 ||
      newCourse.courseContents[0].subSection.length === 0
    ) {
      return toast.error("One section and one sub section is required!");
    }
    setActive(3);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Course Builder</h3>
      <div>
        <div>
          <Label>Section Name</Label>
          <input
            className="bg-richblack-700 text-base p-3 focus:outline-none rounded-lg w-full drop-shadow-[0_1px_rgba(255,255,255,0.5)] relative disabled:bg-richblack-500 disabled:cursor-not-allowed text-richblack-25"
            placeholder="Add a section to build your course"
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="border border-solid border-yellow mt-4 px-4 py-2 rounded-md text-yellow flex items-center gap-2"
            onClick={onClick}
          >
            {isSectionEditing ? "Save changes" : "Create Section"}
            <span>
              <FiPlusCircle size={18} />
            </span>
          </button>
          {isSectionEditing && (
            <button
              className="text-sm underline text-richblack-500 self-end"
              onClick={() => {
                setIsSectionEditing(false);
                setSectionToEdit(null);
                setSectionName("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div
        className="bg-richblack-700 px-6 py-5 rounded-md mt-5"
        style={{
          display: newCourse?.courseContents?.length > 0 ? "block" : "none",
        }}
      >
        {newCourse?.courseContents.length > 0 &&
          newCourse?.courseContents?.map((sec, i) => (
            <Sections
              key={i}
              sectionName={sec.sectionName}
              subSection={sec.subSection}
              isSectionEditing={isSectionEditing}
              setIsSectionEditing={setIsSectionEditing}
              setSectionToEdit={setSectionToEdit}
              index={i}
              removeSection={removeSection}
              sectionId={sec._id}
              courseId={newCourse?._id}
            />
          ))}
      </div>

      <div className="flex items-center gap-2 self-end mt-4">
        <CancelButton
          onClick={() => {
            setActive(1);
            setIsEditing(true);
          }}
        >
          Prev
        </CancelButton>
        <FormButton extraClass="!mt-0" onClick={nextForm}>
          Next
        </FormButton>
      </div>
      {isPending && <SpinnerModal />}
    </div>
  );
};

export default CourseBuilder;
