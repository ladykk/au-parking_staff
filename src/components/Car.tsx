import { FormEvent, useState } from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import Loading from "./Loading";
import { Form, Input, Select, Button } from "./Form";
import Modal, { Body, handleModalFunction, Footer } from "./Modal";
import { AddCarErrors, Car, CarWithRef } from "../types/car";
import { CAR_BRAND_LIST, CAR_COLOR_LIST } from "../constants/car";
import PROVINCE_LISTS from "../constants/provinces";
import { addCar, deleteCar } from "../helpers/car";
import { CustomerWithCarRef } from "../types/customer";
import { handleFormError } from "../utils/error";

// C - License plate.
type LicensePlateProps = {
  license_number?: string;
  province?: string;
  preview?: boolean;
};
export function LicensePlate({
  license_number,
  province,
  preview = false,
}: LicensePlateProps) {
  return (
    <div
      className={
        preview
          ? "w-fit min-w-[200px] bg-white mx-auto px-4 py-3 border-2 border-black rounded-lg flex flex-col gap-1 text-black"
          : "w-fit min-w-[150px] bg-white px-3 py-2 border-2 border-black rounded-lg flex flex-col justify-center gap-1 text-black"
      }
    >
      <p
        className={
          preview
            ? "text-2xl font-semibold text-center"
            : "text-xl font-semibold text-center"
        }
      >
        {license_number ? license_number : "License number"}
      </p>
      {typeof province !== "undefined" && (
        <p className={preview ? "text-center" : "text-center text-sm"}>
          {province ? province : "Province"}
        </p>
      )}
    </div>
  );
}

// [Default States]
const addFormState: Car = {
  license_number: "",
  province: "",
  brand: "",
  color: "",
};

const addErrorsState: AddCarErrors = {
  license_number: "",
  province: "",
  brand: "",
  color: "",
  form: "",
};

// C - Add car modal.
export function AddCarModal({ customer }: { customer: CustomerWithCarRef }) {
  // [States]
  const [form, setForm] = useState<Car>(addFormState);
  const [errors, setErrors] = useState<AddCarErrors>(addErrorsState);
  const [isRequest, setIsRequest] = useState<boolean>(false);
  const [isModalShow, setModalShow] = useState<boolean>(false);

  // [Data]
  const cars = customer.cars ? customer.cars : [];

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow);

  // F - Handle on submit.
  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      setIsRequest(true);
      await addCar(form, customer?.uid, cars);
      setForm(addFormState);
      setErrors(addErrorsState);
      handleModal(false);
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setIsRequest(false);
    }
  };

  return (
    <>
      <Loading isLoading={isRequest} />
      <Modal
        title="Add Car"
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body>
          <Form onSubmit={handleOnSubmit} placeholder="Add" error={errors.form}>
            <div className="my-5">
              <LicensePlate
                license_number={form.license_number}
                province={form.province}
                preview
              />
            </div>
            <Input
              name="license_number"
              placeholder="License Number"
              value={form.license_number}
              setForm={setForm}
              setError={setErrors}
              error={errors.license_number}
              required
            />
            <Select
              name="province"
              placeholder="Province"
              value={form.province}
              setForm={setForm}
              setError={setErrors}
              options={PROVINCE_LISTS}
              error={errors.province}
              required
            />
            <Select
              name="brand"
              placeholder="Brand"
              value={form.brand}
              setForm={setForm}
              setError={setErrors}
              options={CAR_BRAND_LIST}
              error={errors.brand}
              required
            />
            <Select
              name="color"
              placeholder="Color"
              value={form.color}
              setForm={setForm}
              setError={setErrors}
              options={CAR_COLOR_LIST}
              error={errors.color}
              required
            />
          </Form>
        </Body>
      </Modal>
      <PlusCircleIcon
        className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md hover:cursor-pointer"
        onClick={() => handleModal()}
      />
    </>
  );
}

// C - Car remove modal.
type Props = {
  car: CarWithRef;
  user?: "Customer" | "Staff";
};
export function CarRemoveModal({ car, user = "Customer" }: Props) {
  // [States]
  const [isRequest, setIsRequest] = useState<boolean>(false);
  const [isModalShow, setModalShow] = useState<boolean>(false);

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow);

  // F - Remove car.
  const handleDeleteCar = async () => {
    setIsRequest(true);
    await deleteCar(car._ref);
    setIsRequest(false);
    handleModal(false);
  };

  return (
    <>
      <Loading isLoading={isRequest} />
      <Modal
        title={`Remove '${car.license_number}'?`}
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body center>
          {user === "Customer" ? (
            <p>
              You will not received a payment notification from this car. Are
              you sure to remove '{car.license_number}'?
            </p>
          ) : (
            <p>
              Are you sure to remove '{car.license_number}' from the customer?
            </p>
          )}
        </Body>
        <Footer>
          <Button onClick={handleDeleteCar}>Remove</Button>
          <Button variant="outline" onClick={() => handleModal(false)}>
            Cancel
          </Button>
        </Footer>
      </Modal>
      <TrashIcon
        className={`w-8 h-8 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer ${
          user === "Customer" && "text-rose-500"
        }`}
        onClick={() => handleModal(true)}
      />
    </>
  );
}
