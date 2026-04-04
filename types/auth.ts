export type AuthUserDTO = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthResponseDTO = {
  user: AuthUserDTO;
};
