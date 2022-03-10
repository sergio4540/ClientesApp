export interface User {
    idUser?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    passwordConfirmed?: boolean | null;
    emailConfirmed?: boolean | null;
    passwordResetToken?: string;
    passwordResetTokenExpired?: string | null;
    status?: string;
    createdAt?: string | null;
  }