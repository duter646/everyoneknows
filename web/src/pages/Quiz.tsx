import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchPaper, scorePaper } from "../lib/api";
import { AnswerPayload, PaperResponse, QuestionView, ScoreSummary } from "../lib/types";

interface ResultPayload {
  summary: ScoreSummary;
  answers: AnswerPayload[];
  token: string;
  durationSec: number;
  questions: QuestionView[];
}

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get("count")) || 30;
  const [paper, setPaper] = useState<PaperResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerPayload>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const answersRef = useRef(answers);
  const questionStartRef = useRef(Date.now());
  const quizStartRef = useRef(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPaper(count)
      .then((data) => {
        setPaper(data);
        setCurrentIndex(0);
        setAnswers({});
        quizStartRef.current = Date.now();
        questionStartRef.current = Date.now();
      })
      .catch(() => setError("题库加载失败，请稍后重试。"))
      .finally(() => setLoading(false));
  }, [count]);

  const currentQuestion = paper?.questions[currentIndex];
  const selected = currentQuestion ? answers[currentQuestion.id]?.selected || [] : [];

  const progressPercent = useMemo(() => {
    if (!paper) {
      return 0;
    }
    return ((currentIndex + 1) / paper.questions.length) * 100;
  }, [currentIndex, paper]);

  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  const updateAnswer = (questionId: string, selectedIds: number[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        id: questionId,
        selected: selectedIds,
        timeSec: prev[questionId]?.timeSec ?? 0
      }
    }));
  };

  const toggleOption = (optionId: number) => {
    if (!currentQuestion) {
      return;
    }
    if (currentQuestion.type === "single") {
      updateAnswer(currentQuestion.id, [optionId]);
      return;
    }
    if (selected.includes(optionId)) {
      updateAnswer(
        currentQuestion.id,
        selected.filter((item) => item !== optionId)
      );
    } else {
      updateAnswer(currentQuestion.id, [...selected, optionId]);
    }
  };

  const accumulateTime = (questionId: string) => {
    const current = answersRef.current[questionId];
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const prevTime = current?.timeSec ?? 0;
    const newTime = Math.max(0.2, prevTime + elapsed);
    return newTime;
  };

  const finalizeCurrentAnswer = () => {
    if (!currentQuestion) {
      return answersRef.current;
    }
    const accumulatedTime = accumulateTime(currentQuestion.id);
    const current = answersRef.current[currentQuestion.id];
    const updated = {
      ...answersRef.current,
      [currentQuestion.id]: {
        id: currentQuestion.id,
        selected: current?.selected || [],
        timeSec: accumulatedTime
      }
    };
    answersRef.current = updated;
    setAnswers(updated);
    questionStartRef.current = Date.now();
    return updated;
  };

  const goNext = () => {
    finalizeCurrentAnswer();
    setCurrentIndex((prev) => Math.min(prev + 1, (paper?.questions.length || 1) - 1));
  };

  const goPrev = () => {
    finalizeCurrentAnswer();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!paper) {
      return;
    }
    setSubmitting(true);
    const updatedAnswers = finalizeCurrentAnswer();
    const payloadAnswers = Object.values(updatedAnswers);

    try {
      const summary = await scorePaper(paper.token, payloadAnswers);
      const durationSec = Math.max(1, Math.floor((Date.now() - quizStartRef.current) / 1000));
      const payload: ResultPayload = {
        summary,
        answers: payloadAnswers,
        token: paper.token,
        durationSec,
        questions: paper.questions
      };
      sessionStorage.setItem("lastResult", JSON.stringify(payload));
      navigate("/result", { state: payload });
    } catch (err) {
      setError("提交失败，请稍后再试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="section">正在组卷中...</div>;
  }

  if (error) {
    return <div className="section">{error}</div>;
  }

  if (!paper || !currentQuestion) {
    return <div className="section">没有可用题目。</div>;
  }

  const difficultyLabel =
    currentQuestion.difficulty === "easy"
      ? "简单"
      : currentQuestion.difficulty === "medium"
        ? "中等"
        : "困难";

  return (
    <div className="section">
      <div className="quiz-header">
        <div>
          <div className="tag">第 {currentIndex + 1} / {paper.questions.length} 题</div>
          <div className="tag" style={{ marginLeft: 8 }}>{currentQuestion.domain}</div>
          <div className="tag" style={{ marginLeft: 8 }}>{currentQuestion.type === "multiple" ? "多选题" : "单选题"}</div>
          <div className="tag" style={{ marginLeft: 8 }}>{difficultyLabel}</div>
        </div>
        <div className="progress-bar" aria-hidden>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <h2 className="question-title">{currentQuestion.question}</h2>
      <div className="grid">
        {currentQuestion.options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={`option ${isSelected ? "selected" : ""}`}
            >
              <input
                type={currentQuestion.type === "multiple" ? "checkbox" : "radio"}
                name={currentQuestion.id}
                checked={isSelected}
                onChange={() => toggleOption(option.id)}
              />
              <span>{option.text}</span>
            </label>
          );
        })}
      </div>

      <div className="quiz-actions">
        <button className="btn ghost" onClick={goPrev} disabled={currentIndex === 0}>上一题</button>
        {currentIndex < paper.questions.length - 1 ? (
          <button className="btn" onClick={goNext}>下一题</button>
        ) : (
          <button className="btn" onClick={() => setShowConfirm(true)} disabled={submitting}>
            提交答案
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <h3>确认提交吗？</h3>
            <p className="note">提交后将生成成绩与身份画像。</p>
            <div className="form-row" style={{ marginTop: 16 }}>
              <button className="btn" onClick={handleSubmit} disabled={submitting}>
                确认提交
              </button>
              <button className="btn ghost" onClick={() => setShowConfirm(false)}>
                再检查一下
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
