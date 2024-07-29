import { View, Text } from "react-native";

const Formik = ({
  initialValues,
  validationSchema,
  handleSubmit,
  children,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        errors,
        isSubmitting,
        handleSubmit,
        values,
        touched,
      }) => ({ children })}
    </Formik>
  );
};

export default Formik;
