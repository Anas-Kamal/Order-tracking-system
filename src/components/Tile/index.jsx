import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../context/alertContext";

// eslint-disable-next-line react/prop-types
export const Tile = ({ name, url, link }) => {
  const router = useNavigate();
  const { setShowAlert, setAlertMessage } = useContext(AlertContext);
  const onAlert = () => {
    setShowAlert(true);
    setAlertMessage("This Feature is not available in Demo.");
  };

  useEffect(() => {
    return () => {
      setShowAlert(false);
      setAlertMessage();
    };
  }, []);
  return (
    <div
      className="h-fit shadow-md w-3/12 p-2 rounded-lg cursor-pointer bg-secondary-color transition duration-300 delay-150 hover:delay-300"
      onClick={() => (link ? router(link) : onAlert())}
    >
      <img className="m-auto" width={50} src={url} alt={name} />
      <p className="text-center text-black text-xs mt-3">{name}</p>
    </div>
  );
};
