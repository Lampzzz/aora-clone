import Modal from "react-native-modal";
import { ActivityIndicator } from "react-native";

const Loader = ({ isLoading }) => {
  return (
    <Modal isVisible={isLoading} animationIn="fadeIn" animationOut="fadeOut">
      <ActivityIndicator size="large" color="#FF9C01" />
    </Modal>
  );
};

export default Loader;
