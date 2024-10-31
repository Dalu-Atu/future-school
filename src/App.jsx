import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./features/Admin/AdminDashboard";
import AppLayout from "./ui/AppLayout";
import GlobalStyles from "./styles/GlobalStyles";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ClassList from "./ui/ClassList";
import ManageActivities from "./features/Admin/ManageActivities";
import ManageStudents from "./pages/ManageStudents";
import ManageTeachers from "./pages/ManageTeachers";
import { Toaster } from "react-hot-toast";
import ManageSubjects from "./pages/ManageSubjects";
import Managexam from "./pages/Managexam";
import ManagePsychomotor from "./pages/ManageStudentReport";
import ManageId from "./pages/ManageId";
import StudentID from "./pages/StudentID";
import ViewSTudentResults from "./pages/ViewSTudentResults";
import ResultContainer from "./ui/ResultContainer";
import Login from "./pages/Login";
import LoginPortal from "./pages/LoginPortal";
import TeachersDashboard from "./features/Users/UserDashboard";
import TeachersDasbboardOverview from "./features/Users/UserDashboardOverview";
import AddExamScores from "./features/Users/AddExamScores";
import AddStudentreport from "./features/Users/AddStudentReport";
import ProtectedRoute from "./ui/ProtectedRoute";
import { AuthProvider } from "./services/AuthContext";
import Classresults from "./features/Users/ViewClassResults";
import CustomizeUi from "./pages/CustomizeUi";
import { SchoolSettingsProvider } from "./services/settingContext";
import HomePage from "./pages/HomePage";
import Management from "./features/Admin/Management";
import UsersProfile from "./features/Users/UsersProfile";
import ManagementDetails from "./ui/ManagementDetails";
import ManagementProfile from "./ui/ManagementProfile";
import ViewResult from "./features/Users/ViewResult";
import ManageStudentAccess from "./pages/ManageStudentAccess";
import Settings from "./ui/Settings";
import CustomizeApearance from "./ui/CustomizeApearance";
import CustomizeWebsite from "./ui/CustomizeWebsite";
import { ThemeContext } from "./services/ThemeContext";
import { DarkModeProvider } from "./services/DarkModeContext";
import useOnlineStatus from "./utils/online";
import lostConnection from "./assets/no-internet-connection.avif";
import CoursesOverview from "./ui/CoursesOverview";
import ManageActivitiesOption from "./ui/ManageActivitiesOption";
import { GlobalErrorProvider } from "./services/GlobalErrorContext ";
import ErrorBoundary from "./ui/ErrorBoundary ";
import PortalResult from "./pages/PortalResult";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      startTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <img
          style={{
            width: "30rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          src={lostConnection}
          alt=""
        />

        <p>Please check your network cables, modem, and router.</p>
        <p>Reconnecting to Wi-Fi might also help.</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <GlobalErrorProvider>
          <AuthProvider>
            <SchoolSettingsProvider>
              <DarkModeProvider>
                <ThemeContext>
                  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                  <GlobalStyles />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/student-portal" element={<LoginPortal />} />
                      <Route
                        path="/student-result"
                        element={<PortalResult />}
                      />
                      <Route
                        path="viewresult"
                        element={
                          <ProtectedRoute>
                            <ViewResult />
                          </ProtectedRoute>
                        }
                      />

                      {/* //For the teachers section */}

                      <Route
                        element={
                          <ProtectedRoute>
                            <TeachersDashboard />
                          </ProtectedRoute>
                        }
                      >
                        {/* <Route
                      index
                      element={<Navigate replace to="/account/dashboard" />}
                    /> */}
                        <Route
                          path="/account/dashboard"
                          element={<TeachersDasbboardOverview />}
                        />
                        <Route
                          path="/account/managemarks"
                          element={<AddExamScores />}
                        />
                        <Route
                          path="/account/managereports"
                          element={<AddStudentreport />}
                        />
                        <Route
                          path="/account/profile"
                          element={<UsersProfile />}
                        />
                        <Route
                          path="/account/classresults"
                          element={<Classresults />}
                        />
                      </Route>

                      {/* 
                         for the Admin */}

                      <Route
                        path="/class-results"
                        element={<ResultContainer />}
                      />
                      <Route path="/generatedIds" element={<StudentID />} />

                      <Route
                        element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="/mangeid" element={<ManageId />} />
                        <Route
                          path="/results"
                          element={<ViewSTudentResults />}
                        />
                        <Route path="/customize" element={<CustomizeUi />}>
                          <Route
                            index
                            element={
                              <Navigate replace to="/customize/basic-info" />
                            }
                          />
                          <Route
                            path="/customize/basic-info"
                            element={<Settings />}
                          />
                          <Route
                            path="/customize/appearance"
                            element={<CustomizeApearance />}
                          />
                          <Route
                            path="/customize/edit-website"
                            element={<CustomizeWebsite />}
                          />
                        </Route>
                        <Route
                          path="manageteachers"
                          element={<ManageTeachers />}
                        />
                        <Route
                          path="/managepsycomotor"
                          element={<ManagePsychomotor />}
                        />
                        <Route
                          path="/managestudentaccess"
                          element={<ManageStudentAccess />}
                        />
                        <Route path="managexam" element={<Managexam />} />
                        <Route
                          path="managesubjects/:id"
                          element={<ManageSubjects />}
                        />
                        <Route
                          path="managestudents/:id"
                          element={<ManageStudents />}
                        />
                        {/* <Route
                  path="managestudentaccess/:id"
                  element={<ManageStudentAccess />}
                /> */}

                        <Route path="manageschool" element={<Management />}>
                          <Route
                            index
                            element={
                              <Navigate
                                replace
                                to="/manageschool/manageactivities"
                              />
                            }
                          />
                          <Route
                            path="managesubject"
                            element={<ClassList specifiedRoute="subject" />}
                          />
                          <Route
                            path="manageactivities"
                            element={
                              <ManageActivities>
                                <ManageActivities>
                                  <ManagementDetails>
                                    <ManagementProfile />
                                    <CoursesOverview />
                                    <ManageActivitiesOption />
                                  </ManagementDetails>
                                </ManageActivities>
                              </ManageActivities>
                            }
                          />

                          <Route
                            path="manageclass"
                            element={<ClassList specifiedRoute="class" />}
                          />
                          <Route
                            path="managestudents"
                            element={<ClassList specifiedRoute="student" />}
                          />
                        </Route>

                        <Route path="dashboard" element={<Dashboard />}>
                          <Route
                            index
                            element={
                              <Navigate
                                replace
                                to="/dashboard/manageactivities"
                              />
                            }
                          />
                          <Route
                            path="managesubject"
                            element={<ClassList specifiedRoute={"subject"} />}
                          />
                          <Route
                            path="manageactivities"
                            element={
                              <ManageActivities>
                                <ManagementProfile />
                                <CoursesOverview />
                                <ManageActivitiesOption />
                              </ManageActivities>
                            }
                          />
                          <Route
                            path="manageclass"
                            element={<ClassList specifiedRoute="class" />}
                          />
                          <Route
                            path="managestudents"
                            element={<ClassList specifiedRoute={"student"} />}
                          />
                        </Route>
                      </Route>
                    </Routes>
                  </BrowserRouter>
                  <Toaster
                    position="top-center"
                    gutter={12}
                    containerStyle={{ margin: "8px" }}
                    toastOptions={{
                      success: {
                        duration: 3000,
                      },
                      error: {
                        duration: 5000,
                      },
                      style: {
                        fontSize: "16px",
                        maxWidth: "500px",
                        padding: "16px 24px",
                        backgroundColor: "#075985",
                        color: "#fff",
                      },
                    }}
                  />
                </ThemeContext>
              </DarkModeProvider>
            </SchoolSettingsProvider>
          </AuthProvider>
        </GlobalErrorProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
// 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
export default App;
