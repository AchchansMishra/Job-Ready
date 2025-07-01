import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AIResponsePreview from "./components/AIResponsePreview";
import SpinnerLoader from "../../components/loader/SpinnerLoader";
import SkeletonLoader from "../../components/loader/SkeletonLoader";
import QuestionCard from "../../components/Cards/QuestionCard";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Drawer from "../../components/Drawer";
import { toast } from "react-hot-toast";
import { LuListCollapse, LuCircleAlert } from "react-icons/lu";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = useCallback(async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      setSessionData(res.data.session);
    } catch (err) {
      console.error("Error fetching session:", err);
    }
  }, [sessionId]);

  const generateConceptExplanation = async (question) => {
    setErrorMsg("");
    setExplanation(null);
    setIsLoading(true);
    setOpenLearnMoreDrawer(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });

      setExplanation(res.data);
    } catch (err) {
      setErrorMsg("Failed to generate explanation.");
      console.error("Explanation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMoreQuestions = async () => {
    setIsUpdateLoader(true);
    try {
      const { role, experience, topicsToFocus } = sessionData;

      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      });

      const questions = res.data;

      await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions,
      });

      toast.success("Added more Q&A!");
      fetchSessionDetailsById();
    } catch (err) {
      setErrorMsg("Error loading more questions.");
      console.error("Upload error:", err);
    } finally {
      setIsUpdateLoader(false);
    }
  };

  const togglePin = async (questionId) => {
  try {
    await axiosInstance.put(API_PATHS.QUESTION.PIN(questionId));
    fetchSessionDetailsById(); // refresh session after pin toggle
  } catch (err) {
    toast.error("Failed to toggle pin");
    console.error("Pin toggle error:", err);
  }
};


  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
  }, [sessionId, fetchSessionDetailsById]);

  if (!sessionData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <SpinnerLoader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-black mb-4">Interview Q&A</h2>

        {sessionData.questions?.map((q, index) => (
          <QuestionCard
            key={q._id || index}
            question={q.question}
            answer={q.answer}
            onLearnMore={() => generateConceptExplanation(q.question)}
            isPinned={q.isPinned}
            onTogglePin={() => togglePin(q._id)}
          />
        ))}

        {sessionData.questions?.length === 0 && (
          <p className="text-gray-500">No questions found.</p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={uploadMoreQuestions}
            disabled={isUpdateLoader}
            className="bg-black text-white px-5 py-2 rounded-md flex items-center gap-2"
          >
            {isUpdateLoader ? <SpinnerLoader /> : <LuListCollapse />}
            Load More
          </button>
        </div>
      </div>

      <Drawer
        isOpen={openLearnMoreDrawer}
        onClose={() => setOpenLearnMoreDrawer(false)}
        title={explanation?.title}
      >
        {isLoading && <SkeletonLoader />}
        {errorMsg && (
          <p className="text-amber-600 flex items-center gap-1">
            <LuCircleAlert /> {errorMsg}
          </p>
        )}
        {!isLoading && explanation && (
          <AIResponsePreview content={explanation.explanation} />
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default InterviewPrep;
