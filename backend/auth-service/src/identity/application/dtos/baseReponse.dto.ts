export class BaseResponse {
  readonly success: boolean;
  readonly isOperational: boolean;
  readonly requestId: string;
  readonly timeStamp: Date;

  constructor(
    success: boolean,
    isOperational: boolean,
    requestId: string,
    timeStamp: Date,
  ) {
    this.success = success;
    this.isOperational = isOperational;
    this.requestId = requestId;
    this.timeStamp = timeStamp;
  }
}
