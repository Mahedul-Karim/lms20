import React, { useRef, useState } from "react";

import VideoPlayer from "../../ui/VideoPlayer";
import Spinner from "../../ui/Spinner";
import { useDispatch, useSelector } from "react-redux";
import FormButton from "../../ui/inputs/FormButton";
import {
  setSection,
  setSubSection,
  setVideoProgress,
  setSectionProgress,
} from "../../../store/slices/course";
import { useApi } from "../../../hooks/useApi";
import { useToast } from "../../../hooks/useToast";

const Main = ({ isPending }) => {
  const { viewCourse } = useSelector((state) => state.course);

  const { success, error, warning } = useToast();

  const course = viewCourse?.course;
  const selectedSection = viewCourse?.selectedSection;
  const selectedSubSection = viewCourse?.selectedSubSection;
  const progress = viewCourse?.progress;

  const [isEnded, setIsEnded] = useState(false);

  const videoRef = useRef(null);

  const dispatch = useDispatch();

  const sections = course?.courseContents?.map((c) => c);

  const currenctSubSection =
    sections?.[selectedSection]?.subSection?.[selectedSubSection];

  const videoUrl = currenctSubSection?.videoUrl?.url;

  const title = currenctSubSection?.title;
  const id = currenctSubSection?._id;
  const description = currenctSubSection?.description;

  const markAsComplete = (ref) => {
    videoRef.current = ref.current;
  };

  const { mutate } = useApi({
    success: (data) => {
      if (data.message) {
        success(data.message);
      }
    },
    error: (err) => {
      error(err);
    },
  });

  const completeVideoHandler = () => {
    videoRef.current.currentTime = videoRef.current.duration;
    const currentSection = sections[selectedSection];

    const completedVideos = progress.completedVideos;
    const completedSections = progress.completedSections;

    if(completedVideos.includes(id)){
      warning('Video is already marked as completed!');
      return;
    }

    const options = {
      method: "PATCH",
      data: {
        courseId: course._id,
      },
    };

    if (
      currentSection.subSection.length - 1 === selectedSubSection &&
      !completedSections.includes(currentSection._id)
    ) {
      dispatch(setSectionProgress(currentSection._id));
      options.data = {
        ...options.data,
        sectionId: currentSection._id,
      };
    }

    if (!completedVideos.includes(id)) {
      dispatch(setVideoProgress(id));
      options.data = {
        ...options.data,
        videoUrl:id,
      };
    }

    if (options.data.sectionId || options.data.videoUrl) {
      mutate({ endpoint: "course/progress/save", options });
    }
  };

  const rewatchHandler = () => {
    setIsEnded(false);
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  };

  const nextVideoHandler = () => {
    const getSelectedSection = sections[selectedSection];

    if (
      sections.length - 1 === selectedSection &&
      getSelectedSection.subSection.length - 1 === selectedSubSection
    ) {
      return;
    }

    if (getSelectedSection.subSection.length - 1 === selectedSubSection) {
      dispatch(setSection(selectedSection + 1));
      dispatch(setSubSection(0));
    } else {
      dispatch(setSubSection(selectedSubSection + 1));
    }
  };

  return (
    <div className="flex flex-col gap-2 py-4 text-richblack-600 bg-white px-2 400px:px-4 rounded-xl border border-solid border-border">
      {isPending ? (
        <div className="flex items-center justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="lg:min-h-[400px] flex flex-col gap-3">
            <FormButton
              extraClass="!mt-0 self-end bg-primary"
              onClick={completeVideoHandler}
            >
              Mark as Complete
            </FormButton>
            <div className="relative">
              <VideoPlayer
                src={videoUrl}
                key={videoUrl}
                markAsComplete={markAsComplete}
                setIsEnded={setIsEnded}
              />
              {isEnded && (
                <div className="absolute inset-0 w-full h-full z-10 bg-richblack-800/[0.25] backdrop-blur-[2px] flex items-center justify-center">
                  <div className="flex flex-col gap-4">
                    <FormButton extraClass="!mt-0 bg-primary" onClick={nextVideoHandler}>
                      Next
                    </FormButton>
                    <button
                      className="rounded-lg bg-tertiary py-[6px] 400px:py-[8px] px-[8px] 400px:px-[12px] font-medium text-richblack-25 text-[14px] 400px:text-base"
                      onClick={rewatchHandler}
                    >
                      Rewatch
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-base ">{description}</p>
        </>
      )}
    </div>
  );
};

export default Main;
