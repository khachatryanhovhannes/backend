import { ErrorCode, HttpException } from "./root";

export class InvalidTokenException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
