export type Roles = 'user' | 'custom' | 'moderator' | 'admin';

export const roles = {
  user: 'user',
  moderator: 'moderator',
  admin: 'admin',
};

const roles_volume = {
  user: 25,
  moderator: 50,
  custom: 75,
  admin: 100,
};

export function roles_checker(user_role: Roles, min_required_role: Roles) {
  if (roles_volume[user_role] >= roles_volume[min_required_role]) return true;
  else return false;
}
