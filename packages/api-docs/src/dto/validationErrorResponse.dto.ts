import { ApiProperty } from "@nestjs/swagger";
import { ValidationDetailDto } from "../dto/validationErrorDetail.dto";
import { ApiErrorResponseDto } from "./errorResponse.dto";
import { MetaDto } from "./meta.dto";

export class ValidationErrorResponseDto extends ApiErrorResponseDto {
  @ApiProperty({ example: "VALIDATION_ERROR" })
  code: string;

  @ApiProperty({ type: () => [ValidationDetailDto] })
  details: ValidationDetailDto[];

  constructor(
    code: string,
    message: string,
    meta: MetaDto,
    details: ValidationDetailDto[],
  ) {
    super(code, message, meta);
    this.code = code;
    this.details = details;
  }
}
