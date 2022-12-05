import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Dispatch,
  FormEvent,
  HTMLInputTypeAttribute,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { Color } from "../types/tailwind";
import { useUpdateFilePreview } from "../utils/hooks";
import { imageResize } from "../utils/resizer";
import ImageViewer from "./ImageViewer";

// C - Form button.
type ButtonProps = {
  children: string | ReactNode;
  onClick?: any;
  type?: "submit" | "button" | "reset";
  variant?: "outline" | "fill";
  color?: Color;
  fit?: boolean;
};
export function Button({
  children,
  onClick,
  type = "button",
  variant = "fill",
  color = "rose",
  fit = false,
}: ButtonProps) {
  // [Settings]
  const colors = {
    blue: {
      outline:
        "text-blue-500 border-blue-500 hover:bg-blue-200 focus:ring-blue-300",
      fill: "bg-blue-500 hover:bg-blue-400 focus:ring-blue-300",
    },
    gray: {
      outline:
        "text-gray-500 border-gray-500 hover:bg-gray-200 focus:ring-gray-300",
      fill: "bg-gray-500 hover:bg-gray-400 focus:ring-gray-300",
    },
    red: {
      outline:
        "text-red-500 border-red-500 hover:bg-red-200 focus:ring-red-300",
      fill: "bg-red-500 hover:bg-red-400 focus:ring-red-300",
    },
    green: {
      outline:
        "text-green-500 border-green-500 hover:bg-green-200 focus:ring-green-300",
      fill: "bg-green-500 hover:bg-green-400 focus:ring-green-300",
    },
    yellow: {
      outline:
        "text-yellow-500 border-yellow-500 hover:bg-yellow-200 focus:ring-yellow-300",
      fill: "bg-yellow-500 hover:bg-yellow-400 focus:ring-yellow-300",
    },
    indigo: {
      outline:
        "text-indigo-500 border-indigo-500 hover:bg-indigo-200 focus:ring-indigo-300",
      fill: "bg-indigo-500 hover:bg-indigo-400 focus:ring-indigo-300",
    },
    purple: {
      outline:
        "text-purple-500 border-purple-500 hover:bg-purple-200 focus:ring-purple-300",
      fill: "bg-purple-500 hover:bg-purple-400 focus:ring-purple-300",
    },
    pink: {
      outline:
        "text-pink-500 border-pink-500 hover:bg-pink-200 focus:ring-pink-300",
      fill: "bg-pink-500 hover:bg-pink-400 focus:ring-pink-300",
    },
    rose: {
      outline:
        "text-rose-500 border-rose-500 hover:bg-gray-200 focus:ring-rose-300",
      fill: "bg-rose-500 hover:bg-rose-400 focus:ring-rose-300",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={
        variant === "outline"
          ? `${
              fit ? "w-fit" : "w-full"
            } h-12 md:h-10 border-2 bg-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none ${
              colors[color][variant]
            }`
          : `${
              fit ? "w-fit" : "w-full"
            } h-12 md:h-10 text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none ${
              colors[color][variant]
            }`
      }
    >
      {children}
    </button>
  );
}

// C - Form
type FormProps = {
  children?: ReactNode;
  placeholder?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  error?: string;
  hFull?: boolean;
};
export function Form({
  children,
  placeholder = "Submit",
  onSubmit,
  error,
}: FormProps) {
  // [Functions]
  // F - On submit.
  async function handleOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (onSubmit) await onSubmit(e);
  }
  return (
    <form onSubmit={handleOnSubmit} className={`flex flex-col justify-between`}>
      <div>
        {children}
        <p className="my-2 text-sm text-rose-600">{error}</p>
      </div>
      <Button type="submit">{placeholder}</Button>
    </form>
  );
}

// C - Form checkbox.
type CheckboxProps = {
  name: string;
  placeholder: string;
  checked: boolean | undefined;
  setForm: Dispatch<SetStateAction<any>>;
  subPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  setError?: Dispatch<SetStateAction<any>>;
  noSpacer?: boolean;
};
export function Checkbox({
  name,
  placeholder,
  checked,
  setForm,
  subPlaceholder,
  disabled = false,
  required = false,
  error,
  setError,
  noSpacer = false,
}: CheckboxProps) {
  // F - Handle on change.
  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;
    setError &&
      setError((errors: any) => ({
        ...errors,
        [name]: "",
        form: "",
      }));
    setForm((f: any) => ({
      ...f,
      [name]: checked ? true : false,
    }));
  };

  return (
    <div className={`flex ${noSpacer ? "" : "mb-4"}`}>
      <div className="flex items-center h-5">
        <input
          name={name}
          type="checkbox"
          checked={checked}
          onChange={handleOnChange}
          className="w-4 h-4 text-rose-600 bg-gray-100 rounded border-gray-300 focus:ring-rose-500"
          disabled={disabled}
        />
      </div>
      <div className="ml-2 text-sm">
        <label
          className={`
              font-medium ${disabled ? "text-gray-400" : "text-gray-900"}
          `}
        >
          {placeholder} {required && <span className="text-rose-500">*</span>}
        </label>
        <p
          id="helper-checkbox-text"
          className="text-xs font-normal text-gray-500"
        >
          {subPlaceholder}
        </p>
      </div>
    </div>
  );
}

// C - Form toggle.
export function Toggle({
  name,
  placeholder,
  checked,
  setForm,
  subPlaceholder,
  disabled = false,
  required = false,
  error,
  setError,
  noSpacer = false,
}: CheckboxProps) {
  // F - Handle on change.
  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;
    setError &&
      setError((errors: any) => ({
        ...errors,
        [name]: "",
        form: "",
      }));
    setForm((f: any) => ({
      ...f,
      [name]: checked ? true : false,
    }));
  };

  return (
    <div className={`flex ${noSpacer ? "" : "mb-4"}`}>
      <label className="inline-flex relative items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={checked}
          onChange={handleOnChange}
          disabled={disabled}
          required={required}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rose-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">
          {placeholder} {required && <span className="text-rose-500">*</span>}
        </span>
      </label>
      <p
        id="helper-checkbox-text"
        className="text-xs font-normal text-gray-500"
      >
        {subPlaceholder}
      </p>
    </div>
  );
}

// C - Form file input.
type FileInputProps = {
  name: string;
  placeholder: string;
  setForm: Dispatch<SetStateAction<any>>;
  required?: boolean;
  disabled?: boolean;
  limitMB?: number;
  limitSize?: { width: number; height: number };
  error?: string;
  setError?: Dispatch<SetStateAction<any>>;
  preview?: boolean;
};
export function FileInput({
  name = "",
  placeholder = "",
  setForm,
  required = false,
  disabled = false,
  limitMB,
  limitSize,
  error,
  setError,
  preview,
}: FileInputProps) {
  // [Settings]
  const color = error ? "rose" : "gray";

  // [States]
  const [isFile, setIsFile] = useState<boolean>(false);
  const [previewInput, setPreviewInput] = useState<string>("");

  // [Refs]
  const inputRef = useRef<HTMLInputElement>(null);

  // [Data]
  const inputValue = inputRef.current?.files?.item(0);

  // [Hooks]
  useUpdateFilePreview(inputValue, setPreviewInput);

  // [Functions]
  // F - On click.
  const handleOnClick = () => inputRef.current?.click();

  // F - On input change.
  const handleInputChange = async (e: FormEvent<HTMLInputElement>) => {
    let file: File | null | undefined = e.currentTarget.files?.item(0);
    setError && setError((error: any) => ({ ...error, [name]: "", form: "" }));

    if (file && typeof limitMB === "number") {
      if (limitSize)
        file = await imageResize(file, limitSize.width, limitSize.height);

      const sizeMB = file.size / 1000000;
      if (sizeMB > limitMB) {
        setError &&
          setError((error: any) => ({
            ...error,
            [name]: `File is larger than ${limitMB} MB. (${sizeMB.toFixed(
              2
            )} MB.)`,
          }));

        file = null;
      }
    }
    setForm((f: any) => ({ ...f, [name]: file }));

    const isFile = file !== null;
    if (!isFile) e.currentTarget.value = "";
    setIsFile(isFile);
  };

  // F - On remove file.
  const handleRemoveFile = () => {
    setIsFile(false);
    setForm((f: any) => ({ ...f, [name]: null }));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full mb-4 rounded-lg">
      <label className={`block mb-2 text-sm font-medium text-${color}-600`}>
        {placeholder} {required && <span className="text-rose-500">*</span>}{" "}
        {limitMB && (
          <span className="text-gray-500 text-xs">(Limit: {limitMB} MB.)</span>
        )}
      </label>
      <div className="flex gap-2 items-center">
        {preview && previewInput && (
          <ImageViewer
            button
            src={previewInput}
            title={`${placeholder} Preview`}
          />
        )}

        <div className="w-full h-12 md:h-10 flex items-center">
          {!inputValue && (
            <p
              onClick={handleOnClick}
              className="px-4 md:px-3 h-full flex justify-center items-center bg-rose-500 rounded-l-lg text-white font-medium text-sm cursor-pointer hover:bg-rose-300 flex-shrink-0"
            >
              Choose File
            </p>
          )}
          <p
            onClick={handleOnClick}
            className={`pl-3 flex-1 text-sm h-full text-gray-900 bg-gray-50  border border-gray-300 cursor-pointer focus:outline-none flex items-center ${
              inputValue ? "rounded-lg" : "rounded-r-lg"
            }`}
          >
            {inputValue?.name ? inputValue.name : "No file chosen."}
          </p>
        </div>
        <input
          name={name}
          className="hidden"
          accept="image/*"
          type="file"
          onChange={handleInputChange}
          required={required}
          disabled={disabled}
          ref={inputRef}
        />
        {isFile && (
          <XMarkIcon
            className="w-12 md:w-10 h-12 md:h-10 p-2 rounded-lg bg-gray-50 border border-gray-300 hover:text-rose-500 hover:bg-gray-100 hover:cursor-pointer flex-shrink-0"
            onClick={handleRemoveFile}
          />
        )}
      </div>
      <p className="mt-2 text-sm text-rose-600">{error}</p>
    </div>
  );
}

// C - Form input.
type InputProps = {
  name: string;
  placeholder: string;
  value: string | number | undefined;
  setForm: Dispatch<SetStateAction<any>>;
  required?: boolean;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  error?: string;
  setError?: Dispatch<SetStateAction<any>>;
  noSpacer?: boolean;
  subfix?: string;
};
export function Input({
  name = "",
  placeholder = "",
  value,
  setForm,
  required = false,
  disabled = false,
  type = "text",
  error,
  setError,
  noSpacer,
  subfix,
}: InputProps) {
  // [Settings]
  const color = error ? "rose" : "gray";

  // [Functions]
  // F - On input change.
  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;
    setError &&
      setError((errors: any) => ({
        ...errors,
        [name]: "",
        form: "",
      }));

    setForm((f: any) => ({
      ...f,
      [name]:
        newValue !== ""
          ? type === "number"
            ? parseFloat(newValue)
            : newValue
          : type === " number"
          ? 0
          : "",
    }));
  };

  return (
    <div className={`${!noSpacer && "mb-4"}`}>
      <label className={`block mb-2 text-sm font-medium text-${color}-600`}>
        {placeholder} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type={type}
          id={name}
          name={name}
          className={`bg-gray-50 border border-${color}-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full h-12 md:h-10 p-2.5 ${
            type === "datetime-local" ? "min-w-[95%] flex" : ""
          }`}
          value={value}
          onChange={handleOnChange}
          required={required}
          disabled={disabled}
          step={type === "datetime-local" ? 1 : undefined}
        />
        {subfix && (
          <p
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-center rounded-lg block w-fit min-w-[3rem] md:min-w-[2.5rem] h-12 md:h-10 p-2`}
          >
            {subfix}
          </p>
        )}
      </div>
      <p className="mt-2 text-sm text-rose-600">{error}</p>
    </div>
  );
}

// C - Form select.
type SelectProps = {
  name: string;
  placeholder: string;
  value: any;
  setForm: Dispatch<SetStateAction<any>>;
  required?: boolean;
  error?: string;
  setError?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
  options?: Array<any>;
  sidePlaceHolder?: boolean;
  noSpacer?: boolean;
};
export function Select({
  name = "",
  placeholder = "",
  value,
  setForm,
  required = false,
  error,
  setError,
  disabled = false,
  options = [],
  sidePlaceHolder = false,
  noSpacer = false,
}: SelectProps) {
  // [Settings]
  const color = error ? "rose" : "gray";

  // [Functions]
  // F - On input change.
  const handleOnchange = (e: FormEvent<HTMLSelectElement>) => {
    const newValue = e.currentTarget.value;
    setError &&
      setError((errors: any) => ({
        ...errors,
        [name]: "",
        form: "",
      }));
    setForm((f: any) => ({ ...f, [name]: newValue ? newValue : "" }));
  };

  return (
    <div
      className={`${noSpacer ? "" : "mb-4"} ${
        sidePlaceHolder ? "flex gap-2 items-center" : ""
      }`}
    >
      <label
        className={`block ${
          sidePlaceHolder ? "" : "mb-2"
        } text-sm font-medium text-${color}-600`}
      >
        {placeholder} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        className={`bg-gray-50 border border-${color}-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full h-12 md:h-10 p-2.5`}
        value={value}
        disabled={disabled}
        onChange={handleOnchange}
        required={required}
      >
        <option value="" hidden disabled>
          Choose a {placeholder.toLowerCase()}
        </option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

// C - Form textarea.
type TextAreaProps = {
  name: string;
  placeholder: string;
  value: any;
  setForm: Dispatch<SetStateAction<any>> | undefined;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  setError?: Dispatch<SetStateAction<any>>;
};
export function TextArea({
  name = "",
  placeholder = "",
  value,
  setForm,
  required = false,
  disabled = false,
  error,
  setError,
}: TextAreaProps) {
  // [Settings]
  const color = error ? "rose" : "gray";

  // [Functions]
  // F - On input change.
  const handleOnChange = (e: FormEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;
    setError &&
      setError((errors: any) => ({
        ...errors,
        [name]: "",
        form: "",
      }));

    setForm &&
      setForm((f: any) => ({ ...f, [name]: newValue ? newValue : "" }));
  };

  return (
    <div className="mb-4">
      <label className={`block mb-2 text-sm font-medium text-${color}-600`}>
        {placeholder} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        rows={6}
        className={`bg-gray-50 border border-${color}-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full p-2.5`}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        required={required}
        disabled={disabled}
      ></textarea>
      <p className="mt-2 text-sm text-rose-600">{error}</p>
    </div>
  );
}
