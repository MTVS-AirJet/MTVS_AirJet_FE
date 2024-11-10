import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import logoImage from '../assets/back.jpg';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('${logoImage}');
  background-size: cover;
  background-position: center;
`;

const Modal = styled.div`
  background-color: rgba(255, 255, 255, 0.95); /* 반투명 효과 */
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #b6e3ffd9;
  display: flex; /* 좌우 배치 */
  gap: 20px; /* 좌우 간격 */
`;

const MapWrapper = styled.div`
  width: 370px;
  height: 370px;
  border-radius: 5px;
  overflow: hidden;
`;

const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const LocalNameInput = styled.input`
  padding: 10px;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
`;

const LatitudLongitudeInput = styled.input`
  padding: 10px;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  &::placeholder {
    color: black; /* 원하는 색상으로 변경 */
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const MissionButton = styled(Button)`
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const MapSearch = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null); // Google Maps 인스턴스를 참조

  // 상태 관리
  const [region, setRegion] = useState('');
  const [latitude, setLatitude] = useState(37.7749); // 기본값: 샌프란시스코
  const [longitude, setLongitude] = useState(-122.4194);

  // 5km 범위의 LatLngBounds 계산
  const getBounds = (lat, lng) => {
    const R = 6371; // 지구 반지름 (단위: km)
    const distance = 2.5; // 반지름 거리 (단위: km)
    const latDelta = (distance / R) * (180 / Math.PI); // 위도 차이
    const lngDelta = (distance / R) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180); // 경도 차이

    return {
      south: lat - latDelta,
      west: lng - lngDelta,
      north: lat + latDelta,
      east: lng + lngDelta,
    };
  };

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds(
        { lat: getBounds(latitude, longitude).south, lng: getBounds(latitude, longitude).west },
        { lat: getBounds(latitude, longitude).north, lng: getBounds(latitude, longitude).east }
      );
      mapRef.current.fitBounds(bounds); // 지도 영역을 맞춤
    }
  }, [latitude, longitude]);

  // 지역명 검색 핸들러
  const handleSearch = () => {
    const mockData = {
      '대평리': { latitude: 37.12345, longitude: 127.12345 },
    };

    if (mockData[region]) {
      setLatitude(mockData[region].latitude);
      setLongitude(mockData[region].longitude);
    } else {
      alert('지역명을 찾을 수 없습니다.');
    }
  };

  return (
    <Container>
      <Modal>
        <MapWrapper>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: latitude, lng: longitude }}
              zoom={14}
              options={{
                mapTypeId: 'satellite',
                disableDefaultUI: true, // 기본 UI 비활성화
              }}
              onLoad={(map) => (mapRef.current = map)} // Google Maps 인스턴스 참조 저장
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          </LoadScript>
        </MapWrapper>
        <InputWrapper>
          <Title>Create Mission (Map)</Title>
          <InputGroup>
            <LocalNameInput
              type="text"
              placeholder="지역명을 입력하세요"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Button onClick={handleSearch}>검색</Button>
          </InputGroup>
          <InputGroup>
            <LatitudLongitudeInput
              type="text"
              placeholder="위도 : "
              value={`위도 : ${latitude}`}
              readOnly
            />
          </InputGroup>
          <InputGroup>
            <LatitudLongitudeInput
              type="text"
              placeholder="경도 : "
              value={`경도 : ${longitude}`}
              readOnly
            />
          </InputGroup>
          <MissionButton onClick={() => navigate('/map/create', { state: { region, latitude, longitude } })}>
            미션 만들기
          </MissionButton>
        </InputWrapper>
        <CloseButton onClick={() => navigate(-1)}>X</CloseButton>
      </Modal>
    </Container>
  );
};

export default MapSearch;
