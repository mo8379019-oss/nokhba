export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "العنصر") {
    super(`${resource} غير موجود`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "غير مصرح لك بالدخول") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "ليس لديك صلاحية للقيام بهذا الإجراء") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message = "البيانات موجودة بالفعل") {
    super(message, 409);
  }
}
