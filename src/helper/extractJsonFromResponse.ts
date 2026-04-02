/**
 * Extracts JSON from AI response that may contain markdown formatting or extra text
 * @param response - The raw response string from the AI
 * @returns Parsed JSON object
 */
export const extractJsonFromResponse = async (response: string | null | undefined): Promise<any> => {
    if (!response) {
        throw new Error("No response provided to extract JSON from");
    }

    try {
        // Remove markdown code blocks if present
        let jsonString = response.trim();
        
        // Remove ```json and ``` markers
        jsonString = jsonString.replace(/```json\s*/gi, '');
        jsonString = jsonString.replace(/```\s*/g, '');
        
        // Try to find JSON object in the response
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }
        
        // Parse and return the JSON
        const parsedJson = JSON.parse(jsonString);
        return parsedJson;
        
    } catch (error) {
        console.error("Error parsing JSON from response:", error);
        console.error("Original response:", response);
        throw new Error("Failed to extract valid JSON from AI response");
    }
};