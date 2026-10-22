export const naverSearch='https://map.naver.com/p/search/'+encodeURIComponent('대전 서구 둔산중로78번길 40');
export const naverDirections='https://map.naver.com/p/directions/-/3zyUmy,2zX8SV,'+encodeURIComponent('대전 서구 둔산중로78번길 40')+',,ADDRESS_POI/-/transit?c=15.00,0,0,0,dh';
// Address/coordinate provenance is documented in docs/LOCATION-SOURCES.md.
export const mapEmbed='https://www.openstreetmap.org/export/embed.html?bbox=127.3858%2C36.3514%2C127.3921%2C36.3555&layer=mapnik&marker=36.35343255365%2C127.38894536516';
export const mapUrl='https://www.openstreetmap.org/?mlat=36.35343255365&mlon=127.38894536516#map=18/36.35343255365/127.38894536516';
export function officeMap(id='office-map'){
  return `<div class="office-map"><div id="${id}" class="map-frame"><iframe src="${mapEmbed.replaceAll('&','&amp;')}" title="봉화빌딩 위치 지도 · 대전 서구 둔산중로78번길 40" width="800" height="420" loading="lazy" referrerpolicy="no-referrer"></iframe></div><div class="map-caption"><span>봉화빌딩 · 402호</span><a href="${mapUrl}" target="_blank" rel="noopener noreferrer">지도 크게 보기 ↗</a></div><p class="map-attribution">지도 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap 기여자</a> · 상세 경로는 네이버 길찾기에서 확인하세요.</p></div>`;
}
