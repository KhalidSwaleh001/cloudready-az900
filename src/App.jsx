
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

const QUESTION_BANK = [
  {
    id: 1,
    topic: "Cloud concepts",
    question: "What is cloud computing?",
    options: [
      "Using only a local computer to store all data",
      "Delivering computing services over the internet",
      "Installing every application on a physical server you own",
      "Using computers without a network connection",
    ],
    answer: 1,
    explanation:
      "Cloud computing delivers services such as servers, storage, databases, and software over the internet.",
  },
  {
    id: 2,
    topic: "Cloud concepts",
    question: "Which cloud model combines public cloud services with private cloud infrastructure?",
    options: ["Public cloud", "Private cloud", "Hybrid cloud", "Community cloud"],
    answer: 2,
    explanation:
      "A hybrid cloud combines public and private cloud environments, allowing data and applications to move between them when appropriate.",
  },
  {
    id: 3,
    topic: "Cloud concepts",
    question: "Which pricing model lets you pay for cloud resources as you use them?",
    options: [
      "Fixed hardware ownership",
      "Consumption-based pricing",
      "One-time lifetime payment for all services",
      "Paying only for unused resources",
    ],
    answer: 1,
    explanation:
      "Consumption-based pricing means you pay according to the resources you consume rather than buying all the infrastructure upfront.",
  },
  {
    id: 4,
    topic: "Cloud concepts",
    question: "What is an advantage of cloud scalability?",
    options: [
      "Resources can be adjusted to meet demand",
      "Applications can never experience downtime",
      "All services become free",
      "Security configuration is no longer needed",
    ],
    answer: 0,
    explanation:
      "Scalability allows resources to be increased or decreased to meet changing workloads.",
  },
  {
    id: 5,
    topic: "Azure architecture and services",
    question: "What is an Azure region?",
    options: [
      "A user account in Microsoft Entra ID",
      "A geographic area containing one or more datacenters",
      "A type of virtual machine",
      "A billing invoice",
    ],
    answer: 1,
    explanation:
      "An Azure region is a geographic area that contains one or more datacenters connected through a low-latency network.",
  },
  {
    id: 6,
    topic: "Azure architecture and services",
    question: "Which Azure service provides virtual machines?",
    options: [
      "Azure Virtual Machines",
      "Azure Policy",
      "Microsoft Purview",
      "Azure Advisor",
    ],
    answer: 0,
    explanation:
      "Azure Virtual Machines provides on-demand virtualized computing resources in Azure.",
  },
  {
    id: 7,
    topic: "Azure architecture and services",
    question: "Which Azure service is designed for storing unstructured object data such as images and videos?",
    options: [
      "Azure Virtual Network",
      "Azure Blob Storage",
      "Azure DNS",
      "Azure Monitor",
    ],
    answer: 1,
    explanation:
      "Azure Blob Storage is designed for large amounts of unstructured object data, including documents, images, videos, and backups.",
  },
  {
    id: 8,
    topic: "Azure architecture and services",
    question: "Which Azure service provides a managed platform for hosting web applications?",
    options: [
      "Azure App Service",
      "Azure Cost Management",
      "Azure Policy",
      "Microsoft Entra ID",
    ],
    answer: 0,
    explanation:
      "Azure App Service is a platform-as-a-service offering for hosting web apps and APIs without managing the underlying servers.",
  },
  {
    id: 9,
    topic: "Management and governance",
    question: "What is the primary purpose of Azure Resource Manager (ARM)?",
    options: [
      "To manage Azure resources through a consistent deployment and management layer",
      "To replace all user passwords",
      "To provide physical computer repairs",
      "To create email accounts only",
    ],
    answer: 0,
    explanation:
      "Azure Resource Manager provides a management layer for deploying, organizing, and managing Azure resources.",
  },
  {
    id: 10,
    topic: "Management and governance",
    question: "Which Azure service helps enforce organizational rules on resources?",
    options: ["Azure Policy", "Azure Blob Storage", "Azure DNS", "Azure Files"],
    answer: 0,
    explanation:
      "Azure Policy can audit, restrict, and help enforce organizational standards across Azure resources.",
  },
  {
    id: 11,
    topic: "Management and governance",
    question: "Which service provides recommendations for improving Azure reliability, security, performance, and cost?",
    options: [
      "Azure Advisor",
      "Azure Virtual Network",
      "Azure Queue Storage",
      "Azure Bastion only",
    ],
    answer: 0,
    explanation:
      "Azure Advisor analyzes your Azure environment and provides recommendations across areas such as cost, security, reliability, and performance.",
  },
  {
    id: 12,
    topic: "Management and governance",
    question: "Which Microsoft service manages identities and access to resources?",
    options: [
      "Microsoft Entra ID",
      "Azure Blob Storage",
      "Azure Load Balancer",
      "Azure Monitor",
    ],
    answer: 0,
    explanation:
      "Microsoft Entra ID is Microsoft's cloud-based identity and access management service.",
  },
];

const TOPICS = [
  "All topics",
  "Cloud concepts",
  "Azure architecture and services",
  "Management and governance",
];

function getInitials(email = "") {
  return email.split("@")[0]?.slice(0, 2).toUpperCase() || "CR";
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getPercentage(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function Sidebar({
  user,
  activeView,
  onNavigate,
  onStart,
  onLogout,
}) {
  const email = user?.email || "CloudReady learner";

  return (
    <aside className="sidebar">
      <button
        className="brand"
        type="button"
        onClick={() => onNavigate("dashboard")}
        aria-label="Go to dashboard"
      >
        <span className="brand-icon">C</span>
        <span>CloudReady</span>
      </button>

      <p className="sidebar-label">LEARNING SPACE</p>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <button
          className={`sidebar-item ${
            activeView === "dashboard" ? "active" : ""
          }`}
          type="button"
          onClick={() => onNavigate("dashboard")}
        >
          <span className="nav-icon">▦</span>
          Dashboard
        </button>

        <button
          className={`sidebar-item ${
            activeView === "quiz" ? "active" : ""
          }`}
          type="button"
          onClick={() => onStart("All topics")}
        >
          <span className="nav-icon">✓</span>
          Practice quizzes
        </button>

        <button
          className={`sidebar-item ${
            activeView === "history" ? "active" : ""
          }`}
          type="button"
          onClick={() => onNavigate("history")}
        >
          <span className="nav-icon">◷</span>
          Attempt history
        </button>
      </nav>

      <div className="sidebar-note">
        <div className="sidebar-note-icon">✦</div>
        <strong>Small steps, big progress.</strong>
        <p>Build your Azure knowledge one quiz at a time.</p>
      </div>

      <div className="sidebar-bottom">
        <div className="avatar">{getInitials(email)}</div>

        <div className="user-info">
          <strong title={email}>{email.split("@")[0]}</strong>
          <span>CloudReady learner</span>
        </div>

        <button
          className="icon-button"
          type="button"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
        >
          ↗
        </button>
      </div>
    </aside>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Enter your email address and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Your password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Your account has been created. You are signed in.");
        } else {
          setMessage(
            "Account created. Check your email for the verification link, then return here to sign in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        // The app's auth-state listener will show the dashboard.
      }
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-brand">
            <span className="brand-icon">C</span>
            <span>CloudReady</span>
          </div>

          <div className="auth-hero">
            <span className="eyebrow light">YOUR AZURE JOURNEY STARTS HERE</span>
            <h1>Build your cloud confidence.</h1>
            <p>
              Prepare for the Microsoft Azure Fundamentals AZ-900 exam with
              focused practice, instant feedback, and progress tracking.
            </p>

            <div className="auth-benefits">
              <div><span>✓</span> Practice essential AZ-900 topics</div>
              <div><span>✓</span> Learn from every answer</div>
              <div><span>✓</span> Track your progress over time</div>
            </div>
          </div>

          <div className="auth-visual-footer">
            Microsoft Azure Fundamentals · AZ-900 preparation
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <span className="brand-icon">C</span>
            <strong>CloudReady</strong>
          </div>

          <span className="eyebrow">WELCOME TO CLOUDREADY</span>

          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Sign in to continue your AZ-900 preparation."
              : "Create an account to save your quiz results."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />

            {errorMessage && (
              <div className="notice error-notice" role="alert">
                {errorMessage}
              </div>
            )}

            {message && (
              <div className="notice success-notice" role="status">
                {message}
              </div>
            )}

            <button className="primary-button auth-submit" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMessage("");
                setErrorMessage("");
              }}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>

          <p className="auth-legal">
            Your progress is saved to your CloudReady account.
          </p>
        </div>
      </section>
    </main>
  );
}

function Dashboard({
  user,
  attempts,
  attemptsError,
  attemptsErrorMessage,
  onStart,
  onNavigate,
  onLogout,
}) {
  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, attempt) =>
            sum +
            getPercentage(attempt.score, attempt.total_questions),
          0
        ) / attempts.length
      )
    : 0;

  const latestAttempt = attempts[0];
  const topicCounts = useMemo(
    () =>
      TOPICS.slice(1).map((topic) => ({
        topic,
        count: QUESTION_BANK.filter((question) => question.topic === topic)
          .length,
      })),
    []
  );

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        activeView="dashboard"
        onNavigate={onNavigate}
        onStart={onStart}
        onLogout={onLogout}
      />

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">YOUR LEARNING SPACE</span>
            <h1>Dashboard</h1>
            <p>Keep learning. Keep improving.</p>
          </div>
          <div className="header-pill">
            <span className="status-dot" />
            AZ-900 preparation
          </div>
        </header>

        <section className="welcome-banner">
          <div className="welcome-copy">
            <span className="welcome-label">YOUR NEXT MILESTONE</span>
            <h2>Ready to strengthen your cloud knowledge?</h2>
            <p>
              Take a practice quiz, review your answers, and make every
              attempt count.
            </p>
            <button
              className="banner-button"
              type="button"
              onClick={() => onStart("All topics")}
            >
              Start practicing <span>→</span>
            </button>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-cloud">☁</div>
            <div className="art-check">✓</div>
            <div className="art-spark spark-one">✦</div>
            <div className="art-spark spark-two">✧</div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Learning statistics">
          <article className="stat-card">
            <div className="stat-icon purple-icon">▤</div>
            <span className="stat-label">Quizzes completed</span>
            <strong>{attempts.length}</strong>
            <span className="stat-caption">Saved attempts</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon green-icon">✓</div>
            <span className="stat-label">Average score</span>
            <strong>{attempts.length ? `${averageScore}%` : "—"}</strong>
            <span className="stat-caption">Across completed quizzes</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon orange-icon">◎</div>
            <span className="stat-label">Latest result</span>
            <strong>
              {latestAttempt
                ? `${getPercentage(
                    latestAttempt.score,
                    latestAttempt.total_questions
                  )}%`
                : "—"}
            </strong>
            <span className="stat-caption">
              {latestAttempt ? latestAttempt.topic : "Start your first quiz"}
            </span>
          </article>
        </section>

        <section className="content-grid">
          <div className="panel topics-panel">
            <div className="panel-heading">
              <div>
                <h2>Practice by topic</h2>
                <p>Choose an area to focus on.</p>
              </div>
              <span className="panel-heading-icon">✦</span>
            </div>

            <div className="topic-list">
              {topicCounts.map(({ topic, count }, index) => (
                <button
                  className="topic-row"
                  type="button"
                  key={topic}
                  onClick={() => onStart(topic)}
                >
                  <span className={`topic-number topic-number-${index + 1}`}>
                    0{index + 1}
                  </span>
                  <span className="topic-copy">
                    <strong>{topic}</strong>
                    <span>{count} practice questions</span>
                  </span>
                  <span className="topic-arrow">→</span>
                </button>
              ))}
            </div>

            <button
              className="text-action"
              type="button"
              onClick={() => onStart("All topics")}
            >
              View all practice questions <span>→</span>
            </button>
          </div>

          <div className="panel recent-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent attempts</h2>
                <p>Your latest quiz results.</p>
              </div>
              <button
                className="plain-link"
                type="button"
                onClick={() => onNavigate("history")}
              >
                View all
              </button>
            </div>

            {attemptsError ? (
              <div className="empty-state compact-empty">
                <span className="empty-icon">!</span>
                <strong>Could not load history</strong>
                <p>
                  {attemptsErrorMessage ||
                    "Check your Supabase table, permissions, and connection."}
                </p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="empty-state compact-empty">
                <span className="empty-icon">◷</span>
                <strong>No attempts yet</strong>
                <p>Complete a quiz to see your results here.</p>
                <button
                  className="small-action"
                  type="button"
                  onClick={() => onStart("All topics")}
                >
                  Start a quiz →
                </button>
              </div>
            ) : (
              <div className="recent-list">
                {attempts.slice(0, 4).map((attempt) => {
                  const percentage = getPercentage(
                    attempt.score,
                    attempt.total_questions
                  );

                  return (
                    <article className="recent-row" key={attempt.id}>
                      <div className="recent-check">✓</div>
                      <div className="recent-copy">
                        <strong>{attempt.topic}</strong>
                        <span>{formatDate(attempt.completed_at)}</span>
                      </div>
                      <strong
                        className={
                          percentage >= 70 ? "score-good" : "score-low"
                        }
                      >
                        {percentage}%
                      </strong>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="app-footer">
          CloudReady · Built for your AZ-900 learning journey
        </footer>
      </main>
    </div>
  );
}

function HistoryScreen({
  user,
  attempts,
  attemptsError,
  attemptsErrorMessage,
  onNavigate,
  onStart,
  onLogout,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        activeView="history"
        onNavigate={onNavigate}
        onStart={onStart}
        onLogout={onLogout}
      />

      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">YOUR PROGRESS</span>
            <h1>Attempt history</h1>
            <p>Review your completed quizzes and scores.</p>
          </div>

          <button
            className="primary-button header-action"
            type="button"
            onClick={() => onStart("All topics")}
          >
            Start a quiz <span>→</span>
          </button>
        </header>

        <section className="panel history-panel">
          <div className="panel-heading">
            <div>
              <h2>Completed quizzes</h2>
              <p>
                {attempts.length} saved{" "}
                {attempts.length === 1 ? "attempt" : "attempts"}
              </p>
            </div>
          </div>

          {attemptsError ? (
            <div className="empty-state">
              <span className="empty-icon">!</span>
              <strong>History could not be loaded</strong>
              <p>
                {attemptsErrorMessage ||
                  "Check the Supabase database, table columns, and permissions."}
              </p>
            </div>
          ) : attempts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◷</span>
              <strong>No saved attempts yet</strong>
              <p>
                Complete your first practice quiz to see your results here.
              </p>
              <button
                className="small-action"
                type="button"
                onClick={() => onStart("All topics")}
              >
                Start your first quiz →
              </button>
            </div>
          ) : (
            <div className="history-list">
              {attempts.map((attempt) => {
                const percentage = getPercentage(
                  attempt.score,
                  attempt.total_questions
                );

                return (
                  <article className="history-row" key={attempt.id}>
                    <div className="history-dot">✓</div>

                    <div className="history-copy">
                      <strong>{attempt.topic}</strong>
                      <span>{formatDate(attempt.completed_at)}</span>
                      <span>
                        {attempt.score} correct out of{" "}
                        {attempt.total_questions}
                      </span>
                    </div>

                    <div className="history-result">
                      <strong
                        className={
                          percentage >= 70 ? "score-good" : "score-low"
                        }
                      >
                        {percentage}%
                      </strong>
                      <span>Score</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function QuizScreen({
  user,
  topic,
  onNavigate,
  onLogout,
  onFinish,
}) {
  const questions = useMemo(() => {
    if (topic === "All topics") return QUESTION_BANK;
    return QUESTION_BANK.filter((question) => question.topic === topic);
  }, [topic]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];
  const selectedAnswer = answers[question?.id];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  function chooseAnswer(optionIndex) {
    if (showExplanation) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));
  }

  function revealAnswer() {
    if (selectedAnswer === undefined) return;
    setShowExplanation(true);
  }

  function goToNext() {
    setShowExplanation(false);
    setCurrentIndex((previous) => previous + 1);
  }

  async function submitQuiz() {
    if (submitting) return;

    setSubmitting(true);

    const score = questions.reduce(
      (total, item) =>
        total + (answers[item.id] === item.answer ? 1 : 0),
      0
    );

    const review = questions.map((item) => ({
      ...item,
      selectedAnswer:
        answers[item.id] === undefined ? null : answers[item.id],
      isCorrect: answers[item.id] === item.answer,
    }));

    await onFinish({
      topic,
      score,
      total: questions.length,
      review,
    });

    setSubmitting(false);
  }

  if (!question) {
    return (
      <div className="app-shell">
        <Sidebar
          user={user}
          activeView="quiz"
          onNavigate={onNavigate}
          onStart={() => onNavigate("dashboard")}
          onLogout={onLogout}
        />
        <main className="main-content">
          <div className="panel">
            <h2>No questions available</h2>
            <button
              className="primary-button"
              type="button"
              onClick={() => onNavigate("dashboard")}
            >
              Return to dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        activeView="quiz"
        onNavigate={onNavigate}
        onStart={() => onNavigate("dashboard")}
        onLogout={onLogout}
      />

      <main className="main-content quiz-page">
        <header className="quiz-topbar">
          <button
            className="back-link"
            type="button"
            onClick={() => onNavigate("dashboard")}
          >
            <span>←</span> Dashboard
          </button>
          <span className="quiz-category">AZ-900 PRACTICE</span>
        </header>

        <div className="quiz-container">
          <div className="quiz-heading">
            <span className="eyebrow">PRACTICE SESSION</span>
            <h1>{topic}</h1>
            <p>Choose the best answer for each question.</p>
          </div>

          <div className="quiz-progress-wrap">
            <div className="quiz-progress-labels">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <section className="panel question-panel">
            <div className="question-meta">
              <span className="question-number">
                QUESTION {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="question-topic">{question.topic}</span>
            </div>

            <h2 className="question-title">{question.question}</h2>

            <div className="answer-options">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = question.answer === index;

                let optionClass = "answer-option";
                if (isSelected) optionClass += " selected";
                if (showExplanation && isCorrect) {
                  optionClass += " correct-answer";
                }
                if (showExplanation && isSelected && !isCorrect) {
                  optionClass += " incorrect-answer";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={optionClass}
                    onClick={() => chooseAnswer(index)}
                    disabled={showExplanation}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                    {showExplanation && isCorrect && (
                      <span className="option-status">✓</span>
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <span className="option-status">×</span>
                    )}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="explanation-box">
                <strong>
                  {selectedAnswer === question.answer
                    ? "Correct answer!"
                    : "Not quite — review the explanation"}
                </strong>
                <p>{question.explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              <span className="answered-count">
                {answeredCount} of {questions.length} answered
              </span>

              {!showExplanation ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={revealAnswer}
                  disabled={selectedAnswer === undefined}
                >
                  Check answer <span>→</span>
                </button>
              ) : isLastQuestion ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={submitQuiz}
                  disabled={submitting}
                >
                  {submitting ? "Saving results..." : "Finish quiz"}
                  {!submitting && <span>→</span>}
                </button>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  onClick={goToNext}
                >
                  Next question <span>→</span>
                </button>
              )}
            </div>
          </section>

          <p className="quiz-disclaimer">
            Practice questions are for learning purposes and are not official
            Microsoft exam questions.
          </p>
        </div>
      </main>
    </div>
  );
}

function ResultsScreen({
  user,
  result,
  saveError,
  onNavigate,
  onStart,
  onLogout,
}) {
  const percentage = getPercentage(result.score, result.total);
  const passedPractice = percentage >= 70;

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        activeView="quiz"
        onNavigate={onNavigate}
        onStart={onStart}
        onLogout={onLogout}
      />

      <main className="main-content results-page">
        <div className="results-container">
          <div className="results-celebration" aria-hidden="true">
            {passedPractice ? "✦" : "◎"}
          </div>

          <span className="eyebrow">PRACTICE SESSION COMPLETE</span>
          <h1>{passedPractice ? "Great work!" : "Keep building your skills"}</h1>
          <p className="results-subtitle">
            You have completed the {result.topic} practice quiz.
          </p>

          <section className="panel results-score-panel">
            <span className="score-label">YOUR SCORE</span>
           
<div
  className="score-ring"
  style={{ "--score-progress": `${percentage}%` }}
>
  <div className="score-ring-inner">
    <strong>{percentage}%</strong>
    <span>score</span>
  </div>
</div>

            <h2>
              {result.score} out of {result.total} correct
            </h2>
            <p>
              {passedPractice
                ? "You answered at least 70% correctly. Review any missed answers to strengthen your understanding."
                : "Review the explanations below and try again to improve your score."}
            </p>

            {saveError ? (
              <div className="notice error-notice save-warning" role="status">
                Your result is shown, but it could not be saved to your account:
                {" "}{saveError}
              </div>
            ) : (
              <div className="saved-indicator">
                <span>✓</span> Result saved to your account
              </div>
            )}

            <div className="results-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => onStart(result.topic)}
              >
                Try this topic again <span>↻</span>
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => onStart("All topics")}
              >
                Practice all topics
              </button>
              <button
                className="text-action results-history-link"
                type="button"
                onClick={() => onNavigate("history")}
              >
                View attempt history →
              </button>
            </div>
          </section>

          <section className="panel review-panel">
            <div className="panel-heading">
              <div>
                <h2>Answer review</h2>
                <p>Use each explanation to guide your next attempt.</p>
              </div>
            </div>

            <div className="review-list">
              {result.review.map((item, index) => (
                <article className="review-item" key={item.id}>
                  <div
                    className={`review-status ${
                      item.isCorrect ? "review-correct" : "review-incorrect"
                    }`}
                  >
                    {item.isCorrect ? "✓" : "×"}
                  </div>

                  <div className="review-content">
                    <span className="review-question-number">
                      QUESTION {index + 1}
                    </span>
                    <h3>{item.question}</h3>
                    <p className="review-your-answer">
                      <strong>Your answer:</strong>{" "}
                      {item.selectedAnswer === null
                        ? "Not answered"
                        : item.options[item.selectedAnswer]}
                    </p>
                    {!item.isCorrect && (
                      <p className="review-correct-answer">
                        <strong>Correct answer:</strong>{" "}
                        {item.options[item.answer]}
                      </p>
                    )}
                    <p className="review-explanation">{item.explanation}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [attemptsError, setAttemptsError] = useState(false);
  const [attemptsErrorMessage, setAttemptsErrorMessage] = useState("");
  const [view, setView] = useState("dashboard");
  const [selectedTopic, setSelectedTopic] = useState("All topics");
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error("Unable to check session:", error);
      }

      setUser(data?.session?.user ?? null);
      setCheckingSession(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setUser(session?.user ?? null);
      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadAttempts = useCallback(async (userId) => {
    if (!userId) {
      setAttempts([]);
      setAttemptsError(false);
      setAttemptsErrorMessage("");
      return;
    }

    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("id, topic, score, total_questions, completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Unable to load quiz attempts:", error);
      setAttemptsError(true);
      setAttemptsErrorMessage(
        error.message || "An unknown database error occurred."
      );
      return;
    }

    setAttempts(data ?? []);
    setAttemptsError(false);
    setAttemptsErrorMessage("");
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadAttempts(user.id);
    } else {
      setAttempts([]);
      setAttemptsError(false);
      setAttemptsErrorMessage("");
    }
  }, [user?.id, loadAttempts]);

  function startQuiz(topic = "All topics") {
    setSelectedTopic(topic);
    setResult(null);
    setSaveError("");
    setView("quiz");
  }

  async function finishQuiz(quizResult) {
    setResult(quizResult);
    setSaveError("");

    const { error } = await supabase.from("quiz_attempts").insert({
      user_id: user.id,
      topic: quizResult.topic,
      score: quizResult.score,
      total_questions: quizResult.total,
    });

    if (error) {
      console.error("Unable to save quiz attempt:", error);
      setSaveError(error.message || "Unknown database error.");
    } else {
      await loadAttempts(user.id);
    }

    setView("results");
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Unable to sign out:", error);
      alert(`Unable to sign out: ${error.message}`);
      return;
    }

    setAttempts([]);
    setResult(null);
    setView("dashboard");
  }

  if (checkingSession) {
    return (
      <main className="loading-screen">
        <div className="loading-mark">C</div>
        <div className="loading-spinner" />
        <p>Preparing your learning space...</p>
      </main>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (view === "quiz") {
    return (
      <QuizScreen
        key={`${selectedTopic}-${Date.now()}`}
        user={user}
        topic={selectedTopic}
        onNavigate={setView}
        onLogout={handleLogout}
        onFinish={finishQuiz}
      />
    );
  }

  if (view === "results" && result) {
    return (
      <ResultsScreen
        user={user}
        result={result}
        saveError={saveError}
        onNavigate={setView}
        onStart={startQuiz}
        onLogout={handleLogout}
      />
    );
  }

  if (view === "history") {
    return (
      <HistoryScreen
        user={user}
        attempts={attempts}
        attemptsError={attemptsError}
        attemptsErrorMessage={attemptsErrorMessage}
        onNavigate={setView}
        onStart={startQuiz}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      attempts={attempts}
      attemptsError={attemptsError}
      attemptsErrorMessage={attemptsErrorMessage}
      onNavigate={setView}
      onStart={startQuiz}
      onLogout={handleLogout}
    />
  );
}
