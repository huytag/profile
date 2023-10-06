import React from "react";
import { Link } from "react-router-dom";
import { Box, Page, Text, Icon, List } from "zmp-ui";
import HeaderComponent from "../../../components/header";

const FrequentlyQuestionPage = () => {
  return (
    <Page
      className="page px-2"
      style={{ paddingTop: "60px" }}
      hideScrollbar={true}
    >
      <HeaderComponent title="Câu hỏi thường gặp" />

      <Box className="px-5 py-3 text-4xl items-center mt-4 bg-white rounded-xl shadow-lg shadow-black-500/50">
        <Box className="flex justify-between border-b border-gray-500 py-2 mb-3">
          <Text.Title className="font-semibold ">Câu hỏi thường gặp</Text.Title>
        </Box>
        <List>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
            return (
              <Link
                to={`${index}`}
                key={index}
                className="block last:border-b-0 border-b-2 border-[#a5a5a5] border-dashed py-1"
              >
                <Box className="flex justify-between my-2">
                  <Text.Title size="normal" className="font-normal">
                    Tập đoàn TH có mấy công ty?
                  </Text.Title>
                  <Icon
                    icon="zi-chevron-right"
                    size="large"
                    className="font-bold"
                  />
                </Box>
              </Link>
            );
          })}
        </List>
      </Box>
    </Page>
  );
};

export default FrequentlyQuestionPage;
