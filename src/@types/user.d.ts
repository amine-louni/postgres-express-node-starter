import { SECRET_USER_FIELDS } from "../constatns";

export interface IUser {
  uuid: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  dob: Date;
  phone_number: string | undefined;
  email_validate_at: Date | undefined;
  bio: string | undefined;
  password?: string;
  id_verified_at: Date | undefined;
  password_changed_at?: Date | undefined;
  password_reset_token?: string | undefined;
  password_reset_pin?: string | undefined;
  is_active: boolean;
  profile_picture_url: string;
  email_validation_pin: string | undefined;
  email_validation_pin_expires_at: Date | undefined;
  password_reset_pin_expires_at: Date | undefined;
}

type secretUserFields = typeof SECRET_USER_FIELDS[number];

type forbiddendUserFieldsToUpdate =
  typeof FORBIDDEN_USER_FIELDS_TO_UPDATE[number];
export type allowFieldsType = typeof ALLOWED_USER_FIELDS_TO_UPDATE[number];
