export const promptTemplateFront = (text: string) => `Extract the following information from the given text from an Emirates ID card front side:
    - ID Number (XXX-YYYY-XXXXXXX-X format)
    - Name (Full name as shown on card)
    - Date of Birth (DD/MM/YYYY format)
    - Nationality
    - Issuing Date (DD/MM/YYYY format)
    - Expiry Date (DD/MM/YYYY format)
    - Sex (Male/Female)
    - Card Type (if available)

    Text: ${text}

    Important instructions:
    - Extract dates in DD/MM/YYYY format
    - If any field is missing or unclear, return null for that field
    - The text uses \\n as a line break
    - Return ONLY valid JSON without any markdown formatting
    - Use camelCase for field names: idNumber, name, dateOfBirth, nationality, issuingDate, expiryDate, sex, cardType

    Return your response in JSON format with all the above fields as keys.`

export const promptTemplateBack = (text: string) => `Extract the following information from the given text from an Emirates ID card back side:

    - Name (First and last name)
    - ID Number (XXX-YYYY-XXXXXXX-X format, should be visible on back too)
    - Date of Birth (DD/MM/YYYY format)
    - Sex (Male/Female)
    - Nationality
    - Expiry Date (DD/MM/YYYY format)
    - Employer: (Name of employer if available)
    - Occupation (Job title or occupation if available)
    - Issuing Place (City or authority that issued the card)

    The backside has various information such as Occupation, Employer, Issuing Place. Some information are in a Machine Readable Zone (MRZ). If the user is UAE local UAE, his card will have the Issuing place only. Then for both local and foreigner there is a machine readable code in the bottom part of the backside. For example -

    ILARE1313609928784199941028500
    9909014M2508234SYR<<<<<<<<<<<1
    ALSAEED<<ALAMIR<KHALEDWALID<<<

    Explaination of Line-1
    ILARE → Document code + issuing country/authority.
    I = ID card
    LARE = Issuing authority code (UAE)
    1313609928 → Card number (with check digit).
    784199941028500 → ID number (Emirates ID personal number).

    Explaination of Line-2
    990901 → Date of birth (YYMMDD) → 1999-09-01.
    4 → Check digit for DOB.
    M → Sex → Male.
    250823 → Expiry date (YYMMDD) → 2025-08-23.
    4 → Check digit for expiry date.
    SYR → Nationality → Syrian Arab Republic.
    <<<<<<<<<<< → Filler characters (no data).
    1 → Overall check digit.

    Explaination of Line-3
    ALSAEED → Last Name.
    << → Separator.
    ALAMIR<KHALEDWALID → First and Middle Names (spaces replaced with <).
    <<< → End fillers.

    Text: ${text}

    Important instructions:
    - If any field is missing or unclear, return null for that field
    - The text uses \\n as a line break
    - Return ONLY valid JSON without any markdown formatting
    - Use camelCase for field names: idNumber, name, dateOfBirth, nationality, expiryDate, employer, occupation, issuingPlace

    Return your response in JSON format with all the above fields as keys.`;

export const promptTemplateBoth = (frontText: string, backText: string) => `Extract the following information from the given text from an Emirates ID card front and back sides:

    FRONT SIDE INFORMATION:
    - ID Number (XXX-YYYY-XXXXXXX-X format)
    - Name (Full name as shown on card)
    - Date of Birth (DD/MM/YYYY format)
    - Nationality
    - Issuing Date (DD/MM/YYYY format)
    - Expiry Date (DD/MM/YYYY format)
    - Sex (Male/Female)
    - Card Type (if available)

    BACK SIDE INFORMATION:
    - Name (First and last name)
    - ID Number (XXX-YYYY-XXXXXXX-X format)
    - Date of Birth (DD/MM/YYYY format)
    - Sex (Male/Female)
    - Nationality
    - Expiry Date (DD/MM/YYYY format)
    - Employer: (Name of employer if available)
    - Occupation (Job title or occupation if available)
    - Issuing Place (City or authority that issued the card)

    Front Side Text: ${frontText}

    Back Side Text: ${backText}

    Machine Readable Zone (MRZ) Information Guide:
    The backside has various information such as Occupation, Employer, Issuing Place. Some information are in a Machine Readable Zone (MRZ). If the user is UAE local UAE, his card will have the Issuing place only. Then for both local and foreigner there is a machine readable code in the bottom part of the backside. For example -

    ILARE1313609928784199941028500
    9909014M2508234SYR<<<<<<<<<<<1
    ALSAEED<<ALAMIR<KHALEDWALID<<<

    Explaination of Line-1
    ILARE → Document code + issuing country/authority.
    I = ID card
    LARE = Issuing authority code (UAE)
    1313609928 → Card number (with check digit).
    784199941028500 → ID number (Emirates ID personal number).

    Explaination of Line-2
    990901 → Date of birth (YYMMDD) → 1999-09-01.
    4 → Check digit for DOB.
    M → Sex → Male.
    250823 → Expiry date (YYMMDD) → 2025-08-23.
    4 → Check digit for expiry date.
    SYR → Nationality → Syrian Arab Republic.
    <<<<<<<<<<< → Filler characters (no data).
    1 → Overall check digit.

    Explaination of Line-3
    ALSAEED → Last Name.
    << → Separator.
    ALAMIR<KHALEDWALID → First and Middle Names (spaces replaced with <).
    <<< → End fillers.

    Important instructions:
    - Extract dates in DD/MM/YYYY format
    - If any field is missing or unclear, return null for that field
    - The text uses \\n as a line break
    - << → Separator or filler characters, ignore them when extracting names and other fields
    - Return ONLY valid JSON without any markdown formatting
    - Use camelCase for field names:
      * From Front: idNumber, name, dateOfBirth, nationality, issuingDate, expiryDate, sex, cardType
      * From Back: name, idNumber, dateOfBirth, sex, nationality, expiryDate, employer, occupation, issuingPlace

    Return your response in the following JSON structure with separate frontSide and backSide objects:
    {
      "frontSide": {
        "idNumber": string | null,
        "name": string | null,
        "dateOfBirth": string | null,
        "nationality": string | null,
        "issuingDate": string | null,
        "expiryDate": string | null,
        "sex": string | null,
        "cardType": string | null
      },
      "backSide": {
        "name": string | null,
        "idNumber": string | null,
        "dateOfBirth": string | null,
        "sex": string | null,
        "nationality": string | null,
        "expiryDate": string | null,
        "employer": string | null,
        "occupation": string | null,
        "issuingPlace": string | null
      }
    }`