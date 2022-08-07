import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const BackButton = ({ customNav }: { customNav?: string }) => {
  const navigate = useNavigate();

  const handleGoBackOnePage = () => {
    if (customNav) {
      navigate(customNav);
    } else {
      navigate(-1);
    }
  };
  return (
    <IoArrowBackCircleOutline
      size={25}
      className="header_back_button"
      onClick={handleGoBackOnePage}
    />
  );
};
