import {
  faEnvelopeOpenText,
  faPenToSquare,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { Box, Page, Input, Text, Icon, List } from "zmp-ui";
import HeaderComponent from "../../../components/header";
import Select2Component from "../../../components/select2";

const HelpCenterPage = () => {
  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Trung tâm trợ giúp" />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between border-b border-gray-500 py-2 mb-3">
          <Text.Title className="font-semibold ">Dịch vụ khách hàng</Text.Title>
        </Box>
        <List>
          <Link
            to="/support"
            className="block last:border-b-0 border-b-2 border-[#a5a5a5] border-dashed py-1"
          >
            <Box className="flex justify-between my-2">
              <Box className="flex items-center">
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
                <Box ml={2}>
                  <Text.Title size="normal" className="font-normal">
                    Lịch sử hỗ trợ
                  </Text.Title>
                  <Text.Title
                    size="small"
                    className="font-normal text-gray-400 mt-2"
                  >
                    Xem các yêu cầu hỗ trợ trước đây
                  </Text.Title>
                </Box>
              </Box>
              <Icon
                icon="zi-chevron-right"
                size="large"
                className="font-bold"
              />
            </Box>
          </Link>
          <Link
            to="tel:1800545440"
            className="block last:border-b-0 border-b-2 border-[#a5a5a5] border-dashed py-1"
          >
            <Box className="flex justify-between my-2">
              <Box className="flex items-center">
                <FontAwesomeIcon icon={faPhoneVolume} />
                <Box ml={2}>
                  <Text.Title size="normal" className="font-normal">
                    Gọi điện trực tiếp
                  </Text.Title>
                  <Text.Title
                    size="small"
                    className="font-normal text-gray-400 mt-2"
                  >
                    Hotline: 1800 54 54 40
                  </Text.Title>
                </Box>
              </Box>
              <Icon
                icon="zi-chevron-right"
                size="large"
                className="font-bold"
              />
            </Box>
          </Link>
          <Link
            to="/support/create"
            className="block last:border-b-0 border-b-2 border-[#a5a5a5] border-dashed py-1"
          >
            <Box className="flex justify-between my-2">
              <Box className="flex items-center">
                <FontAwesomeIcon icon={faPenToSquare} />
                <Box ml={2}>
                  <Text.Title size="normal" className="font-normal">
                    Gửi phiếu yêu cầu hỗ trợ
                  </Text.Title>
                  <Text.Title
                    size="small"
                    className="font-normal text-gray-400 mt-2"
                  >
                    Gửi phiếu yêu cầu hỗ trợ
                  </Text.Title>
                </Box>
              </Box>
              <Icon
                icon="zi-chevron-right"
                size="large"
                className="font-bold"
              />
            </Box>
          </Link>
        </List>
      </Box>
    </Page>
  );
};

export default HelpCenterPage;
