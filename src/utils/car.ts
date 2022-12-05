import { LICENSE_NUMBER_CHARS } from "../constants/car";

export function isThaiLicenseNumber(license_number: string): boolean {
  let isThaiLicenseNumber = true;
  for (let char of license_number) {
    if (!LICENSE_NUMBER_CHARS.includes(char)) {
      isThaiLicenseNumber = false;
    }
  }
  return isThaiLicenseNumber;
}

export function keyOfLicenseNumber(license_number: string): string {
  return license_number.replace(/\s/g, "");
}
