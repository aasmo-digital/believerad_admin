import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/RegisterForm";

import RootLayout from "../layout/root";
import Home from "../pages/home";
import Analytics from "../pages/analytics";
import ReportsSales from "../pages/reports-sales";
import ReportsLeads from "../pages/reports-leads";
import ReportsProject from "../pages/reports-project";
import AppsChat from "../pages/apps-chat";
import LayoutApplications from "../layout/layoutApplications";
import AppsEmail from "../pages/apps-email";
import ReportsTimesheets from "../pages/reports-timesheets";
import LoginCover from "../pages/login-cover";
import AppsTasks from "../pages/apps-tasks";
import AppsNotes from "../pages/apps-notes";
import AppsCalender from "../pages/apps-calender";
import AppsStorage from "../pages/apps-storage";
import Proposalist from "../pages/proposal-list";
import CustomersList from "../pages/customers-list";
import ProposalView from "../pages/proposal-view";
import ProposalEdit from "../pages/proposal-edit";
import LeadsList from "../pages/leadsList";
import CustomersView from "../pages/customers-view";
import CustomersCreate from "../pages/customers-create";
import ProposalCreate from "../pages/proposal-create";
import LeadsView from "../pages/leads-view";
import LeadsCreate from "../pages/leads-create";
import PaymentList from "../pages/payment-list";
import PaymentView from "../pages/payment-view/";
import PaymentCreate from "../pages/payment-create";
import ProjectsList from "../pages/projects-list";
import ProjectsView from "../pages/projects-view";
import ProjectsCreate from "../pages/projects-create";
import SettingsGaneral from "../pages/settings-ganeral";
import LayoutSetting from "../layout/layoutSetting";
import SettingsSeo from "../pages/settings-seo";
import SettingsTags from "../pages/settings-tags";
import SettingsEmail from "../pages/settings-email";
import SettingsTasks from "../pages/settings-tasks";
import SettingsLeads from "../pages/settings-leads";
import SettingsMiscellaneous from "../pages/settings-miscellaneous";
import SettingsRecaptcha from "../pages/settings-recaptcha";
import SettingsLocalization from "../pages/settings-localization";
import SettingsCustomers from "../pages/settings-customers";
import SettingsGateways from "../pages/settings-gateways";
import SettingsFinance from "../pages/settings-finance";
import SettingsSupport from "../pages/settings-support";
import LayoutAuth from "../layout/layoutAuth";
import LoginMinimal from "../pages/login-minimal";
import LoginCreative from "../pages/login-creative";
import RegisterCover from "../pages/register-cover";
import RegisterMinimal from "../pages/register-minimal";
import RegisterCreative from "../pages/register-creative";
import ResetCover from "../pages/reset-cover";
import ResetMinimal from "../pages/reset-minimal";
import ResetCreative from "../pages/reset-creative";
import ErrorCover from "../pages/error-cover";
import ErrorCreative from "../pages/error-creative";
import ErrorMinimal from "../pages/error-minimal";
import OtpCover from "../pages/otp-cover";
import OtpMinimal from "../pages/otp-minimal";
import OtpCreative from "../pages/otp-creative";
import MaintenanceCover from "../pages/maintenance-cover";
import MaintenanceMinimal from "../pages/maintenance-minimal";
import MaintenanceCreative from "../pages/maintenance-creative";
import HelpKnowledgebase from "../pages/help-knowledgebase";
import WidgetsLists from "../pages/widgets-lists";
import WidgetsTables from "../pages/widgets-tables";
import WidgetsCharts from "../pages/widgets-charts";
import WidgetsStatistics from "../pages/widgets-statistics";
import WidgetsMiscellaneous from "../pages/widgets-miscellaneous";
import AllCampaigns from "../pages/AllCampaigns";
import AllSubAdmin from "../pages/AllSubAdmin";
import AllLocations from "../pages/AllLocations";
import UsersList from "../pages/UserList";
import AllTotalSlots from "../pages/AllTotalSlots";
import TotalAvailableSlots from "../pages/TotalAvailableSlots";
import TotalBookedSlots from "../pages/TotalBookedSlots";
import TotalPeakedSlots from "../pages/TotalPeakedSlots";
import TotalNormalSlots from "../pages/TotalNormalSlots";
import TotalBookedPeakedSlots from "../pages/TotalBookedPeakesSlots";
import TotalBookedNormalSlots from "../pages/TotalBookedNormalSlots";
import AddSubAdmin from "../pages/AddSubAdmin";
import AddLocation from "../pages/AddLocation";
import ApprovedCampaigns from "../pages/ApprovedCampaigns";
import PendingCampaigns from "../pages/PendingCampaigns";
import RejectedCampaigns from "../pages/RejectedCampaigns";
import AddCampaign from "../pages/AddCampaign";
import ViewUserProfile from "../pages/ViewUserProfile";
import LocationProfile from "../pages/LocationProfile";
import MediaRoomPlayer from "../pages/MediaRoomPlayer";
import MediaRoomWrapper from "../pages/MediaRoomWrapper ";
import { AdminAddMedia } from "../pages/AdminAddMedia";
import StandalonePlayerPage from "@/components/StandalonePlayerPage";



export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />, // Initial redirect
  },
  {
    path: "/login",
    element: <LoginPage /> // Standalone Login Page
  },
  {
    path: "/register",
    element: <Register /> // Standalone Register Page
  },

  // --- YAHAN APNA NAYA STANDALONE PLAYER ROUTE ADD KAREIN ---
  {
    path: "/embed/player/:locationId",
    element: <StandalonePlayerPage />, // Yeh kisi layout ke andar nahi hai
  },
  // --- END OF NEW ROUTE ---

  {
    path: "/", // Yeh path "/" hai, lekin upar wala redirect ise /login bhej dega.
               // Yeh tabhi active hoga jab aap /home jaise child routes par navigate karenge.
    element: <RootLayout />,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      // LoginPage ko RootLayout ke child mein rakhne ka matlab nahi banta agar woh standalone hai
      // {
      //   path: "/login-page", // Agar yeh /login se alag hai to theek hai
      //   element: <LoginPage />,
      // }
      // ,
      {
        path: "/dashboards/analytics",
        element: <Analytics />,
      },
      {
        path: "/all-campaigns",
        element: <AllCampaigns />,
      },
      {
        path: "/approved/campaigns",
        element: <ApprovedCampaigns />,
      },
      {
        path: "/pending/campaigns",
        element: <PendingCampaigns />,
      },
      {
        path: "/rejected/campaigns",
        element: <RejectedCampaigns />,
      },
      {
        path: "/all-locations",
        element: <AllLocations />,
      },
      {
        path: "/location/:locationId", // Pehla LocationProfile route
        element: <LocationProfile />,
      },
      {
        path: "/location/:locationId/media-room", // Yeh LocationProfile se zyada specific hai
        element: <MediaRoomWrapper />,
      },
      // NICHE WALA "/location/:locationId" DUPLICATE HAI AUR KABHI REACH NAHI HOGA, ISE HATAYEIN
      // {
      //   path: "/location/:locationId",
      //   element: <LocationProfile />
      // },
      {
        path: "/all-usersList",
        element: <UsersList />
      },
      {
        path: "/user-profile/:id",
        element: <ViewUserProfile />
      },
      {
        path: "/add-campaign",
        element: <AddCampaign />
      },
      {
        path: "/all-sub-Admin",
        element: <AllSubAdmin />
      },
      {
        path: "/add-sub-admin",
        element: <AddSubAdmin />,
      },
      {
        path: "/add-location",
        element: <AddLocation />,
      },
      {
        path: "/total-slots",
        element: <AllTotalSlots />
      },
      {
        path: "/total-available-slots",
        element: <TotalAvailableSlots />
      },
      {
        path: "all-slots", // Note: Relative path, so /all-slots
        element: <TotalBookedSlots />
      },
      {
        path: "total-peaked-slots", // Note: Relative path, so /total-peaked-slots
        element: <TotalPeakedSlots />
      },
      {
        path: "/total-normal-slots",
        element: <TotalNormalSlots />
      },
      {
        path: "/total-booked-peak-slots",
        element: <TotalBookedPeakedSlots />
      },
      {
        path: "/total-booked-normal-slots",
        element: <TotalBookedNormalSlots />
      },
      {
        path: "/add-media",
        element: <AdminAddMedia />
      },
      {
        path: "/clients/payment/report",
        element: <ReportsSales />,
      },
      {
        path: "/reports/leads",
        element: <ReportsLeads />,
      },
      {
        path: "/reports/project",
        element: <ReportsProject />,
      },
      {
        path: "/reports/timesheets",
        element: <ReportsTimesheets />,
      },
      {
        path: "/add-user",
        element: <Proposalist />,
      },
      {
        path: "/proposal/view",
        element: <ProposalView />,
      },
      {
        path: "/proposal/edit",
        element: <ProposalEdit />,
      },
      {
        path: "/proposal/create",
        element: <ProposalCreate />,
      },
      {
        path: "/payment/list",
        element: <PaymentList />,
      },
      {
        path: "/payment/view",
        element: <PaymentView />,
      },
      {
        path: "/payment/create",
        element: <PaymentCreate />,
      },
      {
        path: "/customers/list",
        element: <CustomersList />,
      },
      {
        path: "/customers/view",
        element: <CustomersView />,
      },
      {
        path: "/customers/create",
        element: <CustomersCreate />,
      },
      {
        path: "/leads/list",
        element: <LeadsList />,
      },
      {
        path: "/leads/view",
        element: <LeadsView />,
      },
      {
        path: "/leads/create",
        element: <LeadsCreate />,
      },
      {
        path: "/projects/list",
        element: <ProjectsList />,
      },
      {
        path: "/projects/view",
        element: <ProjectsView />,
      },
      {
        path: "/projects/create",
        element: <ProjectsCreate />,
      },
      {
        path: "/widgets/lists",
        element: <WidgetsLists />,
      },
      {
        path: "/widgets/tables",
        element: <WidgetsTables />,
      },
      {
        path: "/widgets/charts",
        element: <WidgetsCharts />,
      },
      {
        path: "/widgets/statistics",
        element: <WidgetsStatistics />,
      },
      {
        path: "/widgets/miscellaneous",
        element: <WidgetsMiscellaneous />,
      },
      {
        path: "/help/knowledgebase",
        element: <HelpKnowledgebase />,
      },
    ],
  },
  // Baaki ke Layout groups jaise LayoutApplications, LayoutSetting, LayoutAuth
  // waise hi rahenge, unke apne path structure ke saath.
  {
    path: "/", // In sabhi layout groups ka path "/" hai, iska matlab inke children
               // ke specific paths (e.g., "/applications/chat") hi match honge.
    element: <LayoutApplications />,
    children: [
      {
        path: "/applications/chat",
        element: <AppsChat />,
      },
      // ... baaki LayoutApplications ke children
      {
        path: "/applications/email",
        element: <AppsEmail />,
      },
      {
        path: "/applications/tasks",
        element: <AppsTasks />,
      },
      {
        path: "/applications/notes",
        element: <AppsNotes />,
      },
      {
        path: "/applications/calender",
        element: <AppsCalender />,
      },
      {
        path: "/applications/storage",
        element: <AppsStorage />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutSetting />,
    children: [
      {
        path: "/settings/ganeral", // Spelling: general?
        element: <SettingsGaneral />,
      },
      // ... baaki LayoutSetting ke children
      {
        path: "/settings/seo",
        element: <SettingsSeo />,
      },
      {
        path: "/settings/tags",
        element: <SettingsTags />,
      },
      {
        path: "/settings/email",
        element: <SettingsEmail />,
      },
      {
        path: "/settings/tasks",
        element: <SettingsTasks />,
      },
      {
        path: "/settings/leads",
        element: <SettingsLeads />,
      },
      {
        path: "/settings/Support",
        element: <SettingsSupport />,
      },
      {
        path: "/settings/finance",
        element: <SettingsFinance />,
      },
      {
        path: "/settings/gateways",
        element: <SettingsGateways />,
      },
      {
        path: "/settings/customers",
        element: <SettingsCustomers />,
      },
      {
        path: "/settings/localization",
        element: <SettingsLocalization />,
      },
      {
        path: "/settings/recaptcha",
        element: <SettingsRecaptcha />,
      },
      {
        path: "/settings/miscellaneous",
        element: <SettingsMiscellaneous />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutAuth />,
    children: [
      {
        path: "/authentication/login/cover",
        element: <LoginCover />,
      },
      // ... baaki LayoutAuth ke children
      {
        path: "/authentication/login/minimal",
        element: <LoginMinimal />,
      },
      {
        path: "/authentication/login/creative",
        element: <LoginCreative />,
      },
      {
        path: "/authentication/register/cover",
        element: <RegisterCover />,
      },
      {
        path: "/authentication/register/minimal",
        element: <RegisterMinimal />,
      },
      {
        path: "/authentication/register/creative",
        element: <RegisterCreative />,
      },
      {
        path: "/authentication/reset/cover",
        element: <ResetCover />,
      },
      {
        path: "/authentication/reset/minimal",
        element: <ResetMinimal />,
      },
      {
        path: "/authentication/reset/creative",
        element: <ResetCreative />,
      },
      {
        path: "/authentication/404/cover",
        element: <ErrorCover />,
      },
      {
        path: "/authentication/404/minimal",
        element: <ErrorMinimal />,
      },
      {
        path: "/authentication/404/creative",
        element: <ErrorCreative />,
      },
      {
        path: "/authentication/verify/cover",
        element: <OtpCover />,
      },
      {
        path: "/authentication/verify/minimal",
        element: <OtpMinimal />,
      },
      {
        path: "/authentication/verify/creative",
        element: <OtpCreative />,
      },
      {
        path: "/authentication/maintenance/cover",
        element: <MaintenanceCover />,
      },
      {
        path: "/authentication/maintenance/minimal",
        element: <MaintenanceMinimal />,
      },
      {
        path: "/authentication/maintenance/creative",
        element: <MaintenanceCreative />,
      },
    ],
  },
]);
