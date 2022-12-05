import React, { useEffect, useState } from "react";
import { Form, Input } from "../components/Form";
import Loading from "../components/Loading";
import logo from "../assets/logo.png";
import { Navigate, useSearchParams } from "react-router-dom";
import useAuth from "../contexts/auth";
import { FormError, handleFormError } from "../utils/error";
import { StaffSignInErrors, StaffSignInForm } from "../types/staff";
import { StaffLayout } from "../components/Layout";

// [Default States]
const formState = {
  email: "",
  password: "",
};
const errorsState = { email: "", password: "", form: "" };

// P - Staff sign in
function SignIn() {
  // [States]
  const [form, setForm] = useState<StaffSignInForm>(formState);
  const [errors, setErrors] = useState<StaffSignInErrors>(errorsState);

  // [Hooks]
  const { user, loading, loadingInitial, login } = useAuth();
  const [searchParams] = useSearchParams();

  // [Functions]
  // F - Validate.
  // DO: validate inputs.
  const validate = () => {
    for (let attribute in form) {
      switch (attribute) {
        case "email":
          if (form[attribute] === "") {
            throw new FormError({ email: "Please fill email address." });
          }
          break;
        case "password":
          if (form[attribute] === "") {
            throw new FormError({ password: "Please fill password." });
          }
          break;
        default:
      }
    }
  };

  // F - On submit.
  // DO: login with email and password.
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      validate();
      await login(form.email, form.password);
    } catch (e: any) {
      handleFormError(e, Object.keys(errors), setErrors);
    }
  };

  // CASE: staff auth is initializing.
  // DO: return full loading page.
  if (loadingInitial) return <Loading app="Staff" />;

  // CASE: no user.
  // DO: return sign in form.
  if (!user)
    return (
      <StaffLayout title="Sign In">
        <Loading isLoading={loading} />
        <div className="flex justify-center items-center w-full h-full">
          <div className="md:border px-10 py-16 rounded-lg md:shadow w-fit flex flex-col gap-16">
            <div className="flex gap-6 justify-center items-center">
              <img src={logo} alt="" style={{ width: "96px" }} />
              <div>
                <p className="text-rose-500 font-medium text-4xl">AU PARKING</p>
                <p className="text-zinc-500 font-normal text-xl">FOR STAFF</p>
              </div>
            </div>
            <Form
              onSubmit={handleFormSubmit}
              placeholder="Sign In"
              error={errors.form}
            >
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                setForm={setForm}
                setError={setErrors}
                error={errors.email}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                setForm={setForm}
                setError={setErrors}
                error={errors.password}
              />
            </Form>
            <div className="flex flex-col gap-8">
              <p className="text-center font-light text-zinc-500 text-sm">
                Vincent Mary School of Engineering
                <br />
                Assumption University
              </p>
            </div>
          </div>
        </div>
      </StaffLayout>
    );

  // CASE: there is user.
  // DO: redirect page or dashbord by default.

  return (
    <Navigate
      to={
        typeof searchParams.get("redirect") === "string"
          ? (searchParams.get("redirect") as "string")
          : "/dashboard"
      }
      replace
    />
  );
}

export default SignIn;
