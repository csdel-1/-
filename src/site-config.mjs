// Only publish issued verification tokens and a Maps application authorized for this domain.
export const config = {
  siteUrl: 'https://criceto.co.kr',
  naverVerification: '',
  googleVerification: '',
  naverMapKeyId: '',
  // Exact-address building coordinates, cross-checked with the real Naver address result.
  // See docs/LOCATION-SOURCES.md. This indicates the building, not its floor/suite.
  officeCoordinates: {lat:36.35343255365,lng:127.38894536516}
};
