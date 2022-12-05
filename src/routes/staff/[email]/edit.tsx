import { FormEvent, useEffect, useState } from "react";
import {
  Checkbox,
  Form,
  Input,
  Select,
  FileInput,
} from "../../../components/Form";
import { StaffLayout, Header, Main } from "../../../components/Layout";
import { ProfilePhoto } from "../../../components/User";
import { STAFF_ROLE } from "../../../constants/staff";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/store";
import { selectStaffs, selectStaffsUpdateTime } from "../../../redux/staffs";
import { EditStaffForm, EditStaffErrors } from "../../../types/staff";
import { validatePassword } from "../../../utils/user";
import { editStaff } from "../../../helpers/staff";
import { FormError, handleFormError } from "../../../utils/error";
import useAuth from "../../../contexts/auth";
import { useUpdateFilePreview } from "../../../utils/hooks";

// [Default States]
const formState = {
  displayName: "",
  phone_number: "",
  role: "",
  photo: null,
  disabled: false,
  new_password: "",
  confirm_password: "",
};

const errorsState = {
  displayName: "",
  phone_number: "",
  role: "",
  photo: "",
  disabled: "",
  new_password: "",
  confirm_password: "",
  form: "",
};

// P - Edit staff.
function EditStaff() {
  // [State]
  const staffs = useAppSelector(selectStaffs);
  const updateTime = useAppSelector(selectStaffsUpdateTime);
  const [form, setForm] = useState<EditStaffForm>(formState);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [errors, setErrors] = useState<EditStaffErrors>(errorsState);
  const [isRequest, setIsRequest] = useState<boolean>(false);

  // [Hooks]
  const { email } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  useUpdateFilePreview(form.photo, setPhotoPreview);

  // [Data]
  const staff = staffs.find((staff) => staff.email === email);

  // [Effects]
  // E - Set staff into form
  useEffect(() => {
    if (typeof staff?.email === "string") {
      setForm((f) => {
        return {
          ...f,
          displayName: staff.displayName,
          phone_number: staff.phone_number,
          role: staff.role,
          disabled: staff.disabled,
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff?.email]);

  // [Functions]
  // F - On submit.
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      validatePassword(
        form.new_password as string,
        form.confirm_password as string
      );
      setIsRequest(true);
      if (staff && user) {
        await editStaff(form, staff);
        navigate(-1);
      } else {
        throw new FormError({ form: "No staff in the system." });
      }
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setIsRequest(false);
    }
  };

  return (
    <StaffLayout
      title="Edit Staff"
      select="Staffs"
      isLoading={updateTime === "Updating..." || isRequest}
    >
      <Main>
        <Header title="Edit Staff" subTitle={`Email address: ${email}`} />
        <div className="max-w-[550px] mx-auto">
          <Form
            placeholder="Edit Staff"
            onSubmit={handleOnSubmit}
            error={errors.form}
          >
            <div className="flex gap-5 items-center flex-col md:flex-row md:mb-4">
              <ProfilePhoto
                src={photoPreview !== "" ? photoPreview : staff?.photoUrl}
                size="md"
              />
              <FileInput
                name="photo"
                placeholder="Profile photo"
                setForm={setForm}
                limitMB={1}
                limitSize={{ width: 200, height: 200 }}
                error={errors.photo}
                setError={setErrors}
              />
            </div>
            <Checkbox
              name="disabled"
              placeholder="Disabled"
              checked={form.disabled}
              setForm={setForm}
              setError={setErrors}
              disabled={staff?.email === user?.email || staff?.role !== "Staff"}
            />
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
              error={errors.role}
              disabled={staff?.email === user?.email || staff?.role !== "Staff"}
              required
            />
            <Input
              name="new_password"
              placeholder="New password"
              type="password"
              value={form.new_password}
              setForm={setForm}
              setError={setErrors}
              error={errors.new_password}
            />
            <Input
              name="confirm_password"
              placeholder="Confirm password"
              type="password"
              value={form.confirm_password}
              setForm={setForm}
              setError={setErrors}
              error={errors.confirm_password}
            />
          </Form>
        </div>
      </Main>
    </StaffLayout>
  );
}

export default EditStaff;
