import * as React from "react";
import axios from "axios";
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
  useFormik,
} from "formik";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
interface MyFormValues {
  firstName: string;
}

// Create a client
const queryClient = new QueryClient();
export default function Home() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <MyForm />
      </QueryClientProvider>
    </div>
  );
}

function MyForm() {
  const initialValues: MyFormValues = { firstName: "" };
  const [state, setState] = React.useState("");
  const [borderColor, setBorderColor] = React.useState("black");

  const FetchData = async () => {
    console.log("api called");
    const recdata = await axios.post("http://localhost:4000/form", {
      name: state,
    });
    return recdata;
  };

  const { isLoading, data } = useQuery(
    ["input-valid", state, borderColor],
    FetchData,
    {
      onSuccess: (data) => {
        console.log("d", data);
        if (data.data.reserved == true && state !== "") {
          setBorderColor("red");
        } else if (data.data.reserved === false && state !== "") {
          setBorderColor("green");
        }
      },
    }
  );

  function handleChange(event: any) {
    setState(event.target.value);
    setBorderColor("green");
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
        }}
      >
        <form className="text-center">
          <h1 className="text-3xl font-bold mt-6 ">Form</h1>
          <label htmlFor="name"> Name :</label>
          <input
            className="m-2 px-2 rounded w-64"
            style={{
              outline: ` ${borderColor}`,
              border: `2px solid ${borderColor}`,
            }}
            onInput={handleChange}
            id="name"
            name="name"
            placeholder=" Name"
            value={state}
          />
        </form>
      </Formik>
    </>
  );
}
