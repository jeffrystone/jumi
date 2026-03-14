export interface FontSpecimenSample {
  id: string;
  label: string;
  fontSize: string;
  fontWeight: number;
  lineHeight?: string;
  tracking?: string;
  text: string;
}

export interface FontSpecimen {
  id: string;
  title: string;
  fontFamily: string;
  note?: string;
  samples: FontSpecimenSample[];
}
