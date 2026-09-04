import { Prisma } from '@generated/prisma/client';

export type PrismaError = {
  statusCode: number;
  message: string;
  code: string;
};

export function mapPrismaError(error: unknown): PrismaError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorCode = error.code;
    const meta = error.meta;

    switch (errorCode) {
      case 'P2002': {
        // meta = { target: string[] }
        const target: unknown[] = Array.isArray(meta?.target)
          ? meta.target
          : [];
        const firstTarget = target[0];
        const fieldName =
          typeof firstTarget === 'string' ? firstTarget.toUpperCase() : 'DATA';

        return {
          statusCode: 409,
          message: `Invalid data: [${target.join(', ')}]`,
          code: `${fieldName}_ALREADY_EXISTS`,
        };
      }

      case 'P2025': {
        // meta = { modelName?: string, cause?: string }
        const modelName =
          typeof meta?.modelName === 'string'
            ? meta.modelName.toUpperCase()
            : 'RECORD';

        return {
          statusCode: 404,
          message: 'No record found to process',
          code: `${modelName}_NOT_FOUND`,
        };
      }

      case 'P2003': {
        // meta = { field_name: string }
        const rawFieldName =
          typeof meta?.field_name === 'string' ? meta.field_name : '';
        // Làm sạch chuỗi field_name (loại bỏ phần "(index)" hoặc tên fkey nếu có)
        const fieldName =
          rawFieldName.split(' ')[0]?.split('_')[0]?.toUpperCase() ||
          'REFERENCE';

        return {
          statusCode: 400,
          message: 'Invalid reference data (foreign key).',
          code: `INVALID_${fieldName}`,
        };
      }

      default:
        return {
          statusCode: 400,
          message: `Data operation error [${errorCode}].`,
          code: `UNDEFINED_ERROR`,
        };
    }
  }

  // 2. Lỗi Validation (Truyền sai field / thiếu field)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Invalid query structure or data type',
      code: 'INVALID_QUERY',
    };
  }

  // 3. Lỗi Kết nối DB
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: 'Unable to connect to the database',
      code: 'CONNECTION_ERROR',
    };
  }

  // 4. Các lỗi khác
  return {
    statusCode: 500,
    message:
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_SERVER_ERROR',
  };
}
