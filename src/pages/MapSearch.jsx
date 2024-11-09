import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/back.jpg';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('${logoImage}'); /* 배경 이미지 경로 */
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

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapImage = styled.img`
  width: 100%;
  max-width: 350px;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
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

const LatitudLongitudeInputWrapper = styled.input`
  
`

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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const MissionButton = styled(Button)`
  width: 100%;
`;

const MapSearch = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [region, setRegion] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // 지역명 검색 핸들러
  const handleSearch = () => {
    // Mock 데이터 (API 연동 시 실제 데이터로 대체)
    const mockData = {
      '대평리': { latitude: '37.12345', longitude: '127.12345' },
    };

    if (mockData[region]) {
      setLatitude(mockData[region].latitude);
      setLongitude(mockData[region].longitude);
    } else {
      alert('지역명을 찾을 수 없습니다.');
    }
  };

  // 미션 생성 버튼 핸들러
  const handleMissionCreate = () => {
    navigate('/next-page', { state: { region, latitude, longitude } });
  };

  return (
    <Container>
      <Modal>
        <ImageWrapper>
          <MapImage src={logoImage} alt="Map Preview" />
        </ImageWrapper>
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
            <LatitudLongitudeInput type="text" placeholder='위도 : ' value={latitude} readOnly />
          </InputGroup>
          <InputGroup>
            <LatitudLongitudeInput type="text" placeholder='경도 : ' value={longitude} readOnly />
          </InputGroup>
          <MissionButton onClick={handleMissionCreate}>미션 만들기</MissionButton>
        </InputWrapper>
        <CloseButton onClick={() => navigate(-1)}>X</CloseButton>
      </Modal>
    </Container>
  );
};

export default MapSearch;
