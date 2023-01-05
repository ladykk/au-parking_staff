import { FormEvent, useState } from "react";
import { Form, Input, Select, FileInput } from "../../components/Form";
import useAuth from "../../contexts/auth";
import { StaffLayout, Header, Main } from "../../components/Layout";
import { ProfilePhoto } from "../../components/User";
import { STAFF_ROLE } from "../../constants/staff";
import { AddStaffForm, AddStaffErrors } from "../../types/staff";
import { FormError, handleFormError } from "../../utils/error";
import { validatePassword } from "../../utils/user";
import { addStaff } from "../../helpers/staff";
import { useNavigate } from "react-router-dom";
import { useUpdateFilePreview } from "../../utils/hooks";

// [Default States]
const formState = {
  displayName: "",
  email: "",
  phone_number: "",
  role: "",
  photo: null,
  password: "",
  confirm_password: "",
};

const errorsState = {
  displayName: "",
  email: "",
  phone_number: "",
  role: "",
  photo: "",
  password: "",
  confirm_password: "",
  form: "",
};

// P - Add staff.
function AddStaff() {
  // [States]
  const [form, setForm] = useState<AddStaffForm>(formState);
  const [errors, setErrors] = useState<AddStaffErrors>(errorsState);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isRequest, setIsRequest] = useState<boolean>(false);

  // [Hooks]
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useUpdateFilePreview(form.photo, setPhotoPreview);

  // [Functions]
  // F - On submit.
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      validatePassword(form.password, form.confirm_password as string);
      setIsRequest(true);
      if (user) {
        await addStaff(form);
        navigate(-1);
      } else {
        throw new FormError({ form: "Cannot detect staff." });
      }
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setIsRequest(false);
    }
  };

  return (
    <StaffLayout
      title="Add Staff"
      select="Staffs"
      isLoading={isRequest || loading}
    >
      <Main>
        <Header title="Add Staff" />
        <div className="max-w-[550px] mx-auto">
          <Form
            placeholder="Add Staff"
            onSubmit={handleOnSubmit}
            error={errors.form}
          >
            <div className="flex gap-5 items-center flex-col md:flex-row md:mb-4">
              <ProfilePhoto size="md" src={photoPreview} />
              <FileInput
                name="photo"
                placeholder="Profile Photo"
                setForm={setForm}
                limitMB={1}
                limitSize={{ width: 200, height: 200 }}
                error={errors.photo}
                setError={setErrors}
              />
            </div>
            <Input
              name="displayName"
              placeholder="Name"
              value={form.displayName}
              setForm={setForm}
              setError={setErrors}
              error={errors.displayName}
              required
            />
            <Input
              name="phone_number"
              placeholder="Phone number"
              value={form.phone_number}
              setForm={setForm}
              setError={setErrors}
              error={errors.phone_number}
              required
            />
            <Select
              name="role"
              placeholder="Role"
              value={form.role}
              setForm={setForm}
              setError={setErrors}
              options={STAFF_ROLE}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              setForm={setForm}
              setError={setErrors}
              error={errors.email}
              required
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              setForm={setForm}
              setError={setErrors}
              error={errors.password}
              required
            />
            <Input
              name="confirm_password"
              placeholder="Confirm password"
              type="password"
              value={form.confirm_password}
              setForm={setForm}
              setError={setErrors}
              error={errors.confirm_password}
              required
            />
          </Form>
        </div>
      </Main>
    </StaffLayout>
  );
}
export default AddStaff;
