import { EmiratesIdBackData, EmiratesIdFrontData } from "./emiratesIdValidation.types";

export const validateEmiratesId = async (
    frontData: EmiratesIdFrontData,
    backData: EmiratesIdBackData
): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
}> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if ID numbers match
    if (frontData.idNumber && backData.idNumber) {
        if (frontData.idNumber !== backData.idNumber) {
            errors.push("ID numbers do not match between front and back sides");
        }
    } else {
        warnings.push("ID number missing from one or both sides");
    }

    // Validate ID number format
    if (frontData.idNumber) {
        const idPattern = /\d{3}-\d{4}-\d{7}-\d$/;
        if (!idPattern.test(frontData.idNumber)) {
            warnings.push("ID number format may be incorrect (expected: XXX-YYYY-XXXXXXX-X)");
        }
        if (backData.idNumber && !idPattern.test(backData.idNumber)) {
            warnings.push("ID number format on back side may be incorrect (expected: XXX-YYYY-XXXXXXX-X)");
        }
    }

    //Check if expiry date match
    if (frontData.expiryDate && backData.expiryDate) {
        if (frontData.expiryDate !== backData.expiryDate) {
            errors.push("Expiry dates do not match between front and back sides");
        }
    } else {
        warnings.push("Expiry date missing from one or both sides");
    }


    // Validate expiry date
    if (frontData.expiryDate) {
        try {
            const [day, month, year] = frontData.expiryDate.split('/').map(Number);
            const expiryDate = new Date(year, month - 1, day);
            const today = new Date();

            if (expiryDate < today) {
                errors.push("Emirates ID has expired");
            } else {
                // Warn if expiring within 90 days
                const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (daysUntilExpiry <= 90) {
                    warnings.push(`Emirates ID expires in ${daysUntilExpiry} days`);
                }
            }
        } catch (error) {
            warnings.push("Could not validate expiry date format");
        }
    }

    // Check if name matches on both sides (if both are available)
    if (frontData.name && backData.name) {
        const normalizeName = (name: string) => name.replace(/\s+/g, '').trim().toLowerCase();

        console.log(normalizeName(frontData.name));
        console.log(normalizeName(backData.name));

        if (normalizeName(frontData.name) !== normalizeName(backData.name)) {
            errors.push("Names do not match between front and back sides");
        }
    } else {
        warnings.push("Name is missing from one or both sides");
    }


    // Check for missing critical fields
    if (!frontData.name) warnings.push("Name is missing from front side");
    if (!frontData.dateOfBirth) warnings.push("Date of birth is missing from front side");
    if (!frontData.nationality) warnings.push("Nationality is missing from front side");
    if (!backData.employer) warnings.push("Employer is missing from back side");
    if (!backData.occupation) warnings.push("Occupation is missing from back side");
    if (!backData.issuingPlace) warnings.push("Issuing place is missing from back side");

    const isValid = errors.length === 0;

    return {
        isValid,
        errors,
        warnings
    };
};;