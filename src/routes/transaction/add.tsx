import { FormEvent, useEffect, useState } from "react";
import { Form, Input, FileInput, Toggle } from "../../components/Form";
import useAuth from "../../contexts/auth";
import { StaffLayout, Header, Main } from "../../components/Layout";
import {
  AddTransactionErrors,
  AddTransactionForm,
} from "../../types/transaction";

import ImageViewer from "../../components/ImageViewer";
import { handleFormError } from "../../utils/error";
import { useUpdateFilePreview } from "../../utils/hooks";
import { addTransaction } from "../../helpers/transaction";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { selectTransactions } from "../../redux/transactions";

// [Default States]
const formState = {
  manual: false,
  license_number: "",
  timestamp_in: "",
  image_in: null,
};

const errorsState = {
  license_number: "",
  timestamp_in: "",
  image_in: "",
  form: "",
};

function AddTransaction() {
  // [States]
  const transactions = useAppSelector(selectTransactions);
  const [form, setForm] = useState<AddTransactionForm>(formState);
  const [errors, setErrors] = useState<AddTransactionErrors>(errorsState);
  const [imageInPreview, setImageInPreview] = useState<string>("");
  const [isRequest, setIsRequest] = useState<boolean>(false);

  // [Hooks]
  const { user } = useAuth();
  const navigate = useNavigate();
  useUpdateFilePreview(form.image_in, setImageInPreview);

  // [Effects]
  // E - Set add by.
  useEffect(() => {
    setForm((f) => {
      return { ...f, add_by: user ? (user.email as string) : "" };
    });
  }, [user]);

  // [Functions]
  // F - On submit
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      setIsRequest(true);
      await addTransaction(form, transactions);
      navigate(-1);
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setIsRequest(false);
    }
  };

  return (
    <StaffLayout
      title="Add Transaction"
      select="Transactions"
      isLoading={isRequest}
    >
      <Main>
        <Header
          title="Add Transaction"
          btns={[
            <Toggle
              name="manual"
              placeholder="Manual"
              checked={form.manual}
              setForm={setForm}
              noSpacer
            />,
          ]}
        />
        <div className="max-w-[550px] mx-auto">
          <Form
            placeholder="Add Transaction"
            onSubmit={handleOnSubmit}
            error={errors.form}
          >
            {form.manual && (
              <>
                <div className="max-w-[400px] mx-auto mb-4">
                  <ImageViewer title="Image-In" src={imageInPreview} />
                </div>
                <FileInput
                  name="image_in"
                  placeholder="Image-In"
                  setForm={setForm}
                  limitMB={5}
                  limitSize={{ width: 1920, height: 1080 }}
                  error={errors.image_in}
                  setError={setErrors}
                />
              </>
            )}
            <Input
              name="license_number"
              placeholder="License number"
              value={form.license_number}
              setForm={setForm}
              setError={setErrors}
              error={errors.license_number}
              required
            />
            {form.manual && (
              <Input
                name="timestamp_in"
                placeholder="Timestamp-In"
                value={form.timestamp_in}
                type="datetime-local"
                setForm={setForm}
                setError={setErrors}
                error={errors.timestamp_in}
                required
              />
            )}
          </Form>
        </div>
      </Main>
    </StaffLayout>
  );
}

export default AddTransaction;
