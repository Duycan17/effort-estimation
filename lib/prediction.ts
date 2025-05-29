import {
  type ChinaFormValues,
  type DesharnaisFormValues,
  type AlbrechtFormValues,
  type CocomoFormValues,
  type PredictionResponse,
  type ExplanationResponse,
  type Dataset,
} from "@/types/prediction";

const BASE_URL = "http://127.0.0.1:5000";

async function makeApiCall<T, R>(endpoint: string, data: T): Promise<R> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: R = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
}

export async function predictChina(
  values: ChinaFormValues
): Promise<PredictionResponse> {
  return makeApiCall<ChinaFormValues, PredictionResponse>("/china", values);
}

export async function explainChina(
  values: ChinaFormValues
): Promise<ExplanationResponse> {
  return makeApiCall<ChinaFormValues, ExplanationResponse>(
    "/explain/china",
    values
  );
}

export async function predictDesharnais(
  values: DesharnaisFormValues
): Promise<PredictionResponse> {
  return makeApiCall<DesharnaisFormValues, PredictionResponse>(
    "/desharnais",
    values
  );
}

export async function predictAlbrecht(
  values: AlbrechtFormValues
): Promise<PredictionResponse> {
  return makeApiCall<AlbrechtFormValues, PredictionResponse>(
    "/albrecht",
    values
  );
}

export async function predictCocomo(
  values: CocomoFormValues
): Promise<PredictionResponse> {
  return makeApiCall<CocomoFormValues, PredictionResponse>("/cocomo", values);
}

export { type Dataset };
