export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type FieldError = {
  field: string;
  message: string;
};

export type ApiMessage = {
  message: string;
  code?: string;
  field?: string;
  errors?: FieldError[];
};

export type ApiError = ApiMessage;
