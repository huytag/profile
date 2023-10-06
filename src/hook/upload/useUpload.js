import { useState } from "react";
import { apiClient } from "../../services/api";
import { UPLOAD } from "../../utils/constApiRoute";

const useImageUpload = () => {
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = (fileContent) => {
    setLoading(true);

    const fileBlob = new Blob([fileContent], {
      type: "application/octet-stream",
    });

    const formData = new FormData();
    formData.append("file", fileBlob, "filename.jpg");
    formData.append("bucket", "th-trade");
    formData.append("dir", "images");

    apiClient
      .post(UPLOAD, formData)
      .then((response) => {
        setImage(response?.data?.url);
      })
      .catch((error) => setError(error?.message))
      .finally(() => setLoading(false));
  };

  const parseBlob = (file) => {
    fetch(file)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = function () {
          const fileContent = reader.result;

          uploadFile(fileContent);
        };

        reader.readAsArrayBuffer(blob);
      })
      .catch((error) => setError(error?.message));
  };

  return { image, loading, error, parseBlob };
};

export default useImageUpload;
