class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong", // 1. Yahan message add karein
    errors = [],
    stack = ""
  ) {
    super(message); // 2. Ab 'super' ko message mil jayega
    this.statusCode = statusCode;
    this.data = null;
    this.message = message; // 3. Aur yahan bhi
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };