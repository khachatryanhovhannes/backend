import { ErrorCode, HttpException } from "./root";

export class PermissionDeniedException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 403, null);
  }
}
