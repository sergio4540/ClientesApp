export type ApiResponse<T> = {
    isSuccess: boolean;
    result: T;
    message: string;
  };
  