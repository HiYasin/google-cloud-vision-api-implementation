// import { extractJsonFromResponse } from "../helper/extractJsonFromResponse";
import { openai } from "../helper/openRouter";
import { promptTemplateBack, promptTemplateBoth, promptTemplateFront } from "./emiratesIdValidation.constant";
import { EmiratesIdFrontData, EmiratesIdBackData, EmiratesIdBothData } from "./emiratesIdValidation.types";


const getJsonDataFrontSide = async (text: string): Promise<EmiratesIdFrontData> => {

    const prompt = promptTemplateFront(text);

    const response = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI assistant that extracts and formats information from Emirates ID cards into JSON. Always return valid JSON without markdown formatting.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        }
        // temperature: 0.1, // Lower temperature for more consistent output
    });

    // If JSON parsing fails, we can log the raw response for debugging
    // console.log("Front side AI response:", response.choices[0].message.content);
    // const result = await extractJsonFromResponse(response.choices[0].message.content);
    // return result as EmiratesIdFrontData;

    const result = response.choices[0].message.content;
    console.log(JSON.parse(result as string));
    return JSON.parse(result as string) as EmiratesIdFrontData;
}




const getJsonDataBackSide = async (text: string): Promise<EmiratesIdBackData> => {
    const prompt = promptTemplateBack(text);
    const response = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content:
                    "You are a helpful AI assistant that extracts and formats information from Emirates ID cards into JSON. Always return valid JSON without markdown formatting.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        }
        // temperature: 0.1,
    });

    // If JSON parsing fails, we can log the raw response for debugging
    // console.log("Back side AI response:", response.choices[0].message.content);
    // const result = await extractJsonFromResponse(response.choices[0].message.content);
    // return result as EmiratesIdBackData;

    const result = response.choices[0].message.content;
    console.log(JSON.parse(result as string));
    return JSON.parse(result as string) as EmiratesIdBackData;
}




const getJsonDataBothSides = async (frontText: string, backText: string): Promise<EmiratesIdBothData> => {

    const prompt = promptTemplateBoth(frontText, backText);

    const response = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: "You are a helpful AI assistant that extracts and formats information from Emirates ID cards into JSON. Always return valid JSON without markdown formatting.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        response_format: {
            type: "json_object",
        }
        // temperature: 0.1,
    });

    const result = response.choices[0].message.content;
    console.log(JSON.parse(result as string));
    return JSON.parse(result as string) as EmiratesIdBothData;
};



export const emiratesId = {
    getJsonDataFrontSide,
    getJsonDataBackSide,
    getJsonDataBothSides
};