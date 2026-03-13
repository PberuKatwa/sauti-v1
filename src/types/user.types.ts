import type { ApiResponse } from "./api.types";

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: number;
  phone_number_id: number;
  business_account_id: number;
  status: "active" | "inactive" | "trash";
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  phoneNumberId: number;
  businessAccountId: number;
  whatsappAccessToken: string;
}

export interface UpdateUserPayload {
  id: number;
  whatsappAccessToken: string;
  whatsappPermanentToken: string;
}

export interface SingleUserApiResponse extends ApiResponse {
  data: UserProfile;
}

export interface AllUsersApiResponse extends ApiResponse {
  data: {
    users: UserProfile[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  };
}
