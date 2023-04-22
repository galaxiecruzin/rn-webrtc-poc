export const loginHero = (credentials) => ({
  type: "HERO_LOGIN_REQUESTED",
  payload: credentials
})

export const registerHero = (credentials) => ({
  type: "HERO_REGISTRATION_REQUESTED",
  payload: credentials
})
  