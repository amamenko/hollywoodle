import axios from "axios";

export const getGeolocationData = async () => {
  const res = await axios.get(
    `https://geolocation-db.com/json/${process.env.REACT_APP_GEOLOCATION_KEY}`
  );
  if (res.data && res.data.country_code && res.data.country_name) {
    return {
      ip: res.data.IPv4,
      countryCode: res.data.country_code,
      countryName: res.data.country_name,
    };
  } else {
    return;
  }
};
