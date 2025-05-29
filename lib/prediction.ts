import type { FormValues } from "@/components/effort-prediction-form";

interface PredictionResponse {
  explanation: {
    feature_importance: Array<{
      feature: string;
      importance: number;
    }>;
    prediction: number;
  };
  success: boolean;
}

/**
 * Makes an API call to predict project effort
 */
export async function predictEffort(
  values: FormValues
): Promise<PredictionResponse> {
  try {
    const response = await fetch("http://127.0.0.1:5000/explain/china", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        AFP: values.afp,
        Input: values.input,
        Output: values.output,
        Enquiry: values.enquiry,
        File: values.file,
        Interface: values.interface,
        Resource: values.resource,
        Duration: values.duration,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PredictionResponse = await response.json();

    if (!data.success) {
      throw new Error("Prediction request failed");
    }

    return data;
  } catch (error) {
    console.error("Error making prediction:", error);
    throw error;
  }
}
