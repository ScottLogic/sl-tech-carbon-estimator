export const defaultMicrosoft365Values: Required<Microsoft365> = {
  useMicrosoft365: false,
  organisationUserCount: 100,
};

export type Microsoft365 = {
  useMicrosoft365: boolean;
  organisationUserCount: number;
};
