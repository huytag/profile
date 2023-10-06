import React, { useEffect, useState } from "react";
import { Text } from "zmp-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingFlag, faMapPin } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

//TODO : Change to API GOOGLE
const DistanceComponent = ({
  supplier,
  outlet,
  loaded = true,
  distance1,
  distance2,
  passValue = () => {},
}) => {
  const [distance, setDistance] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = "LCnGg1ThwJNFBPZsvuE9rej2a2nYhM02NvdYqgz9";
  const urlApi = "https://rsapi.goong.io/DistanceMatrix?";

  useEffect(() => {
    if (!loaded || isLoaded || !supplier || !outlet) return;

    if (distance1 && distance2) return;

    const getDistance = async () => {
      const origins = `${outlet?.province_coordinate?.address_lat},${outlet?.province_coordinate?.address_lng}`;
      const destinations = `${supplier?.address_lat},${supplier?.address_lng}|${outlet?.address_lat},${outlet?.address_lng}`;

      const url = `${urlApi}origins=${origins}&destinations=${destinations}&vehicle=car&api_key=${apiKey}`;
      await axios
        .get(url)
        .then((response) => {
          setDistance(response.data?.rows[0]?.elements);
          passValue({
            distance_1: (
              response.data?.rows[0]?.elements[0]?.distance?.value / 1000
            ).toFixed(2),
            distance_2: (
              response.data?.rows[0]?.elements[1]?.distance?.value / 1000
            ).toFixed(2),
          });
        })
        .catch((error) => console.log(error));
    };

    getDistance();
    setIsLoaded(true);
  }, [loaded]);

  return (
    <>
      <Text.Title>Quãng đường di chuyển 1</Text.Title>
      <div className="flex items-center justify-between py-3">
        <FontAwesomeIcon icon={faBuildingFlag} size="lg" />
        <div className="ml-3" style={{ width: `calc(100% - 30px)` }}>
          <Text size="small">{supplier?.address ?? "Không có địa chỉ"}</Text>
        </div>
      </div>
      <div className="flex items-center justify-between py-3">
        <FontAwesomeIcon icon={faMapPin} size="lg" />
        <div className="ml-3" style={{ width: `calc(100% - 30px)` }}>
          <Text size="small">
            {outlet?.province_coordinate?.province_name ?? "Không có địa chỉ"}
          </Text>
        </div>
      </div>
      <ul>
        <li className="flex justify-between py-2 border-b border-black last:border-0">
          <Text size="xSmall" className="text-gray-500">
            Khoảng cách di chuyển
          </Text>
          <Text size="xSmall" className="text-gray-500">
            {distance
              ? distance[0]?.distance?.text
              : distance1
              ? `${distance1} km`
              : "...Loading"}
          </Text>
        </li>
      </ul>

      <hr className="mb-4 bg-[#ddd] h-[2px]" />

      <Text.Title>Quãng đường di chuyển 2</Text.Title>
      <div className="flex items-center justify-between py-3">
        <FontAwesomeIcon icon={faMapPin} size="lg" />
        <div className="ml-3" style={{ width: `calc(100% - 30px)` }}>
          {outlet?.province_coordinate?.province_name ?? "Không có địa chỉ"}
        </div>
      </div>
      <div className="flex items-center justify-between py-3">
        <FontAwesomeIcon icon={faBuildingFlag} size="lg" />
        <div className="ml-3" style={{ width: `calc(100% - 30px)` }}>
          <Text size="small">{outlet?.address ?? "Không có địa chỉ"}</Text>
        </div>
      </div>
      <ul>
        <li className="flex justify-between py-2 border-b border-black last:border-0">
          <Text size="xSmall" className="text-gray-500">
            Khoảng cách di chuyển
          </Text>
          <Text size="xSmall" className="text-gray-500">
            {distance
              ? distance[1]?.distance?.text
              : distance2
              ? `${distance2} km`
              : "...Loading"}
          </Text>
        </li>
      </ul>
    </>
  );
};

export default DistanceComponent;
