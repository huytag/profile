import React from "react";
import AuthPage from "../pages/auth";
import CampaignsPage from "../pages/campaigns";
import CampaignAccumulationPage from "../pages/campaigns/accumulation";
import CampaignAccumulationDetailPage from "../pages/campaigns/accumulation/detail";
import CampaignAccumulationSaleman from "../pages/campaigns/accumulation/saleman";
import CampaignDisplayPage from "../pages/campaigns/display";
import CampaignDisplayDetailPage from "../pages/campaigns/display/detail";
import CampaignDisplaySaleman from "../pages/campaigns/display/saleman";
import FrequentlyQuestionPage from "../pages/campaigns/frequently-question";
import FrequentlyQuestionDetailPage from "../pages/campaigns/frequently-question/detail";
import CampaignGiftPage from "../pages/campaigns/gift";
import CampaignGiftDetailPage from "../pages/campaigns/gift/detail";
import CampaignGiftExchangePage from "../pages/campaigns/gift/exchange";
import HelpCenterPage from "../pages/campaigns/help-center";
import CampaignPromotionPage from "../pages/campaigns/promotion";
import CampaignPromotionDetailPage from "../pages/campaigns/promotion/detail";
import CampaignPromotionSaleman from "../pages/campaigns/promotion/saleman";
import CampaignSamplingPage from "../pages/campaigns/sampling";
import CampaignSamplingDetailPage from "../pages/campaigns/sampling/detail";
import CampaignSamplingStorePage from "../pages/campaigns/sampling/store";
import CampaignSetupDetailPage from "../pages/campaigns/setup/detail";
import CampaignSetupResultDetailPage from "../pages/campaigns/setup/detailResults";
import CampaignSetupMainPage from "../pages/campaigns/setup/main";
import CampaignSetUpSaleman from "../pages/campaigns/setup/saleman";
import CampaignWheelPage from "../pages/campaigns/wheel";
import CampaignWheelDetailPage from "../pages/campaigns/wheel/detail";
import CampaignWheelHistoryPage from "../pages/campaigns/wheel/history";
import CampaignLuckySaleman from "../pages/campaigns/wheel/saleman";
import Home from "../pages/home";
import ItemsPage from "../pages/items";
import ItemDetailPage from "../pages/items/detail";
import TicketsOfItemPage from "../pages/items/tickets";
import MePage from "../pages/me";
import NotificationPage from "../pages/notification";
import OrderPage from "../pages/order";
import CreateOrderPage from "../pages/order/create";
import OrderDetailPage from "../pages/order/detail";
import QrPage from "../pages/qr";
import ListSupportPage from "../pages/support";
import CreateSupportPage from "../pages/support/create";
import DetailSupportPage from "../pages/support/detail";
import SurveyPage from "../pages/survey";
import SurveyDetailPage from "../pages/survey/detail";
import TicketPage from "../pages/tickets";
import TicketDetailCommonPage from "../pages/tickets/common";
import * as Permission from "../utils/enumPermission";

const routes = [
  {
    path: "/",
    component: <AuthPage />,
  },
  {
    path: "/home",
    component: <Home />,
  },
  {
    path: "/me",
    component: <MePage />,
  },
  {
    path: "/qr",
    component: <QrPage />,
  },
  // Devices
  {
    path: "/devices",
    component: <ItemsPage />,
    permissions: [...Permission.perItemDefault, Permission.PER_ASSET_ITEM_VIEW],
  },
  {
    path: "/devices/:itemId",
    component: <ItemDetailPage />,
    permissions: [...Permission.perItemDefault, Permission.PER_ASSET_ITEM_VIEW],
  },
  {
    path: "/tickets/:deviceId",
    component: <TicketsOfItemPage />,
    permissions: [
      ...Permission.perItemDefault,
      Permission.PER_ASSET_ITEM_TICKET_HISTORY,
    ],
  },

  // Maintenance
  {
    path: "/maintenance",
    component: <TicketPage />,
    permissions: [
      ...Permission.perTicketDefault,
      Permission.PER_ASSET_TICKET_VIEW,
    ],
  },
  {
    path: "/maintenance/:ticketId",
    component: <TicketDetailCommonPage />,
    permissions: [
      ...Permission.perTicketDefault,
      Permission.PER_ASSET_TICKET_VIEW,
    ],
  },

  // Campaign
  {
    path: "/campaigns",
    component: <CampaignsPage />,
  },

  // Display
  {
    path: "/campaigns/display",
    component: <CampaignDisplayPage />,
  },
  {
    path: "/campaigns/display/:id",
    component: <CampaignDisplayDetailPage />,
  },
  {
    path: "/campaigns/display/:id/saleman",
    component: <CampaignDisplaySaleman />,
  },

  // Sampling
  {
    path: "/campaigns/sampling",
    component: <CampaignSamplingPage />,
  },
  {
    path: "/campaigns/sampling/:campaignId",
    component: <CampaignSamplingStorePage />,
  },
  {
    path: "/campaigns/sampling/:campaignId/:customerId",
    component: <CampaignSamplingDetailPage />,
  },

  // Promotion
  {
    path: "/campaigns/promotion",
    component: <CampaignPromotionPage />,
  },
  {
    path: "/campaigns/promotion/:id",
    component: <CampaignPromotionDetailPage />,
  },
  {
    path: "/campaigns/promotion/:id/saleman",
    component: <CampaignPromotionSaleman />,
  },

  // Accumulation
  {
    path: "/campaigns/accumulation",
    component: <CampaignAccumulationPage />,
  },
  {
    path: "/campaigns/accumulation/:id",
    component: <CampaignAccumulationDetailPage />,
  },
  {
    path: "/campaigns/accumulation/:id/saleman",
    component: <CampaignAccumulationSaleman />,
  },

  // Wheel
  {
    path: "/campaigns/wheel",
    component: <CampaignWheelPage />,
  },
  {
    path: "/campaigns/wheel/:id",
    component: <CampaignWheelDetailPage />,
  },
  {
    path: "/campaigns/wheel/:id/saleman",
    component: <CampaignLuckySaleman />,
  },
  {
    path: "/campaigns/wheel-history",
    component: <CampaignWheelHistoryPage />,
  },

  // Setup
  {
    path: "/campaigns/setup",
    component: <CampaignSetupMainPage />,
  },
  {
    path: "/campaigns/setup/:id",
    component: <CampaignSetupDetailPage />,
  },
  {
    path: "/campaigns/setup-results/:id",
    component: <CampaignSetupResultDetailPage />,
  },
  {
    path: "/campaigns/setup/:id/saleman",
    component: <CampaignSetUpSaleman />,
  },

  // Gift
  {
    path: "/campaigns/gift",
    component: <CampaignGiftPage />,
  },
  {
    path: "/campaigns/gift/:id",
    component: <CampaignGiftDetailPage />,
  },
  {
    path: "/campaigns/gift/:id/exchange/:giftId",
    component: <CampaignGiftExchangePage />,
  },

  // Help center
  {
    path: "/help-center",
    component: <HelpCenterPage />,
  },

  // Frequently question...
  {
    path: "/frequently-question",
    component: <FrequentlyQuestionPage />,
  },
  {
    path: "/frequently-question/:id",
    component: <FrequentlyQuestionDetailPage />,
  },

  // Support
  {
    path: "/support",
    component: <ListSupportPage />,
  },
  {
    path: "/support/:id",
    component: <DetailSupportPage />,
  },
  {
    path: "/support/create",
    component: <CreateSupportPage />,
  },

  // Order
  {
    path: "/order",
    component: <OrderPage />,
  },
  {
    path: "/order/:id",
    component: <OrderDetailPage />,
  },
  {
    path: "/order/create",
    component: <CreateOrderPage />,
  },

  // Notification
  {
    path: "/notification",
    component: <NotificationPage />,
  },

  // Survey
  {
    path: "/survey",
    component: <SurveyPage />,
  },
  {
    path: "/survey/:id",
    component: <SurveyDetailPage />,
  },
];

export default routes;
