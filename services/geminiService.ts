import { GoogleGenAI, Modality } from '@google/genai';
import { fileToBase64 } from '../utils/imageUtils';
import type { EditedImageResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImage = async (imageFile: File, prompt: string): Promise<EditedImageResult> => {
  try {
    const { mimeType, data: base64ImageData } = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // If the prompt was blocked, return this information as a result.
    if (response.promptFeedback?.blockReason) {
      return {
        imageUrl: null,
        text: `Your request was blocked. Reason: ${response.promptFeedback.blockReason}. Please modify your image or prompt and try again.`,
      };
    }

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("The API did not return any candidates, and no block reason was provided.");
    }
    
    const candidate = response.candidates[0];
    let imageUrl: string | null = null;
    let text: string | null = null;

    if (candidate.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          } else if (part.text) {
            text = part.text;
          }
        }
    }

    // If no image was generated, but we got a text response, that's the result.
    // Also, check the finish reason to provide more context.
    if (!imageUrl && candidate.finishReason && candidate.finishReason !== 'STOP') {
        const finishReasonText = `Image generation stopped due to: ${candidate.finishReason}.`;
        text = text ? `${finishReasonText}\n\n${text}` : finishReasonText;
    }

    if (!imageUrl && !text) {
      throw new Error("The API returned an empty response. Your request may have been filtered.");
    }
    
    return { imageUrl, text };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};