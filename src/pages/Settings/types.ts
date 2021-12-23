import { BaseApiResponse } from "../../api";

export interface GenerateApiKeyResponse extends BaseApiResponse {
    apiKey: string;
  }