import axios from "axios";

export const getGeolocationData = async () => {
  const res = await axios
    .get(
      `https://geolocation-db.com/json/${process.env.REACT_APP_GEOLOCATION_KEY}`
    )
    .catch((e) => console.error(e));
  if (res && res.data && res.data.country_code && res.data.country_name) {
    return {
      // ip: res.data.IPv4,
      countryCode: res.data.country_code,
      countryName: res.data.country_name,
      city: res.data.city,
    };
  } else {
    return {};
  }
};
