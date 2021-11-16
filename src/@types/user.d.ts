export interface IUser {
    uuid: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    dob: Date;
    phone_number: string | null;
    email_verified_at: Date | null;
    bio: string | null;
    id_verified_at: Date | null;
    password_changed_at: Date | null;
    paasword_reset_token: Date | null;
    is_active: boolean;
    profile_picture_url: string;
}