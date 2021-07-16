import axios, { AxiosResponse } from "axios";
import { errorToast, successToast } from "./utils";

export interface BaseApiResponse {
  isError: boolean;
}

const _parseResponse = (
  response: AxiosResponse,
  toastErrorMessage?: string,
  toastSuccessMessage?: string
) => {
  if (response.data.isError) {
    if (toastErrorMessage) {
      errorToast(toastErrorMessage);
      console.error(toastErrorMessage);
    }
  } else {
    if (toastSuccessMessage) {
      successToast(toastSuccessMessage);
    }
  }
  return response.data;
};

const get = async <T extends BaseApiResponse>(
  url: string,
  toastErrorMessage?: string,
  toastSuccessMessage?: string
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get(url);
    return _parseResponse(response, toastErrorMessage, toastSuccessMessage);
  } catch (err) {
    if (toastErrorMessage) {
      errorToast(toastErrorMessage);
    }
    return { isError: true } as T;
  }
};

const post = async <T extends BaseApiResponse>(
  url: string,
  body: any,
  toastErrorMessage?: string,
  toastSuccessMessage?: string
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(url, body);
    return _parseResponse(response, toastErrorMessage, toastSuccessMessage);
  } catch (err) {
    if (toastErrorMessage) {
      errorToast(toastErrorMessage);
    }
    return { isError: true } as T;
  }
};

const ApiClient = {
  get,
  post,
};

export default ApiClient;
