export const AUTH_ERROR_CODES = {
  // Auth (4xx)
  USER_NOT_FOUND: { status: 400, message: "User không tồn tại" },
  MISSING_REQUIRED_HEADERS: { status: 400, message: "Thiếu header bắt buộc" },
  INVALID_CREDENTIALS: { status: 401, message: "Mật khẩu sai" },
  INVALID_TOKEN: { status: 401, message: "Token không hợp lệ" },
  TOKEN_EXPIRED: { status: 401, message: "Token hết hạn" },
  EMAIL_ALREADY_EXISTS: { status: 409, message: "Email đã được dùng" },
  ACCOUNT_LOCKED: { status: 403, message: "Tài khoản bị khóa" },
  UNAUTHORIZED: { status: 401, message: "Chưa đăng nhập" },
  FORBIDDEN: {
    status: 403,
    message: "Something wrong happened!!! Please re login",
  },
  NOT_FOUND: { status: 404, message: "Not found" },

  // Validation (422)
  VALIDATION_ERROR: { status: 422, message: "Dữ liệu không hợp lệ" },
  RATE_LIMIT_EXCEEDED: { status: 429, message: "Đã vượt quá giới hạn đăng ký" },

  // Server (5xx)
  INTERNAL_SERVER_ERROR: { status: 500, message: "Lỗi server" },
} as const;
