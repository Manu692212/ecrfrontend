import { Routes, Route } from "react-router-dom";
import IndexPage from "@/pages/Index";
import AboutPage from "@/pages/About";
import CoursesPage from "@/pages/Courses";
import ManagementPage from "@/pages/Management";
import AcademicCouncilPage from "@/pages/AcademicCouncil";
import AdmissionPage from "@/pages/Admission";
import ApplyPage from "@/pages/Apply";
import CareersPage from "@/pages/Careers";
import ContactPage from "@/pages/Contact";
import FacilitiesPage from "@/pages/Facilities";
import NotFoundPage from "@/pages/NotFound";
import { AdminRoutes } from "@/routes/AdminRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/management" element={<ManagementPage />} />
      <Route path="/academic-council" element={<AcademicCouncilPage />} />
      <Route path="/admission" element={<AdmissionPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/facilities" element={<FacilitiesPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
