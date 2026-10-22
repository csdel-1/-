// This adapter loads only when the build has a real authorized key and verified coordinates.
const script=document.currentScript;
const mapHost=document.getElementById('naver-map');
const mapStatus=document.getElementById('map-status');
if(script&&mapHost){
  const {key,lat,lng}=script.dataset;
  const point={lat:Number(lat),lng:Number(lng)};
  if(key&&Number.isFinite(point.lat)&&Number.isFinite(point.lng)){
    const sdk=document.createElement('script');
    sdk.src='https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId='+encodeURIComponent(key);
    sdk.onload=()=>{
      if(!window.naver?.maps?.Map){if(mapStatus)mapStatus.textContent='지도를 불러오지 못했습니다. 아래 네이버 지도 링크를 이용해 주세요.';return;}
      mapHost.classList.add('is-loaded');
      const center=new naver.maps.LatLng(point.lat,point.lng);
      const map=new naver.maps.Map(mapHost,{center,zoom:17,zoomControl:true,scrollWheel:false});
      new naver.maps.Marker({position:center,map,title:'법무사 안상재 사무소 · 봉화빌딩 402호'});
      if(mapStatus)mapStatus.textContent='법무사 안상재 사무소 · 봉화빌딩 402호. 실제 경로는 네이버 지도에서 확인하세요.';
    };
    sdk.onerror=()=>{if(mapStatus)mapStatus.textContent='지도를 불러오지 못했습니다. 아래 네이버 지도 링크를 이용해 주세요.';};
    document.head.append(sdk);
  }
}
