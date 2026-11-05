// Only publish issued verification tokens and a Maps application authorized for this domain.
export const config = {
  siteUrl: 'https://criceto.co.kr',
  naverVerification: 'c45dec5b27ef023cf047ec15e839593434a57893',
  // Keep each verified Google owner's token; one owner may also use a string.
  googleVerification: ['1vuoqDWA7v_GCm_oTTmtR9oCOEKPM7FqqFXWvAmzr8c', 'J5m32LbSzzJEsQ0LiK98SdGsQakLorVq1EQIhaG-Xz0'],
  naverMapKeyId: '',
  // Exact-address building coordinates, cross-checked with the real Naver address result.
  // See docs/LOCATION-SOURCES.md. This indicates the building, not its floor/suite.
  officeCoordinates: {lat:36.35343255365,lng:127.38894536516}
};
