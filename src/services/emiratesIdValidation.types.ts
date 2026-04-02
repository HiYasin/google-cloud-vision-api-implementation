export interface EmiratesIdFrontData {
    idNumber: string | null;
    name: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    issuingDate: string | null;
    expiryDate: string | null;
    sex: string | null;
    cardType: string | null;
}

export interface EmiratesIdBackData {
    name: string | null;
    idNumber: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    expiryDate: string | null;
    employer: string | null;
    occupation: string | null;
    issuingPlace: string | null;
}

export interface EmiratesIdBothData {
    frontSide: EmiratesIdFrontData;
    backSide: EmiratesIdBackData;
}