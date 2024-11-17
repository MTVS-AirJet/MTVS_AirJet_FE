import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
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
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #b6e3ffd9;
  display: flex;
  gap: 20px;
`;

const CenterMarkerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`;

const CenterMarker = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: rgba(255, 0, 0, 0.8);
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const HorizontalLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const VerticalLine = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const MapWrapper = styled.div`
  width: 370px;
  height: 370px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
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
    color: black;
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
  const mapRef = useRef(null);

  const [region, setRegion] = useState('');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);

  const zoom = 14;

  // 지도 중심 업데이트 함수
  const updateMapCenter = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
  };

  // 맵 드래그가 끝난 후 호출되는 핸들러
  const handleMapDragEnd = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setLatitude(center.lat());
      setLongitude(center.lng());
    }
  };

  

  // 위도/경도 입력 핸들러
  const handleLatitudeChange = (e) => {
    const newLatitude = parseFloat(e.target.value);
    setLatitude(newLatitude);
    updateMapCenter(newLatitude, longitude);
  };
  

  const handleLongitudeChange = (e) => {
    const newLongitude = parseFloat(e.target.value);
    setLongitude(newLongitude);
    updateMapCenter(latitude, newLongitude);
  };

  const getStaticMapUrl = (lat, lng, zoomLevel) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const size = '640x640';
    const mapType = 'satellite';

    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoomLevel}&size=${size}&maptype=${mapType}&key=${apiKey}`;
  };

  // 지역 검색 핸들러
  const handleSearch = async () => {
    if (!region.trim()) {
      alert('지역명을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://125.132.216.190:7757/api/geocode',
        { text: region }
      );

      if (response.data) {
        const { latitude: lat, longitude: lng } = response.data;
        setLatitude(lat);
        setLongitude(lng);
        updateMapCenter(lat, lng);
      } else {
        alert('위치를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('검색 요청 중 오류 발생:', error);
      alert('검색 중 오류가 발생했습니다.');
    }
  };

  const handleCapture = () => {
    const imageData = getStaticMapUrl(latitude, longitude, zoom);
    navigate('/map/create', { state: { region, latitude, longitude, imageData } });
  };

  return (
    <Container>
      <Modal>
        <MapWrapper>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: latitude, lng: longitude }}
              zoom={zoom}
              options={{
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                gestureHandling: 'pan',
                scrollwheel: false,
                zoomControl: false,
              }}
              onLoad={(map) => (mapRef.current = map)}
              onDragEnd={handleMapDragEnd} // 드래그 종료 시 호출
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          </LoadScript>
          <CenterMarkerWrapper>
            <HorizontalLine />
            <VerticalLine />
            <CenterMarker />
          </CenterMarkerWrapper>
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
              type="number"
              placeholder="위도 : "
              value={latitude}
              onChange={handleLatitudeChange}
            />
          </InputGroup>
          <InputGroup>
            <LatitudLongitudeInput
              type="number"
              placeholder="경도 : "
              value={longitude}
              onChange={handleLongitudeChange}
            />
          </InputGroup>
          <MissionButton onClick={handleCapture}>미션 만들기</MissionButton>
        </InputWrapper>
        <CloseButton onClick={() => navigate(-1)}>X</CloseButton>
      </Modal>
    </Container>
  );
};

export default MapSearch;
