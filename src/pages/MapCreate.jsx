import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import mapImage from '../assets/back.jpg'; // 맵 이미지 경로
import logoImage from '../assets/back.jpg';

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('${logoImage}'); /* 배경 이미지 */
  background-size: cover;
  background-position: center;
`;

const Modal = styled.div`
  background-color: rgba(255, 255, 255, 0.95); /* 반투명 효과 */
  padding: 20px;
  border-radius: 10px;
  width: 1100px;
  height: 650px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #b6e3ffd9;
  display: flex; /* 좌우 배치 */
  gap:25px; /* 좌우 간격 */
`;

const LeftSection = styled.div`
  flex: 7;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 30px;
  gap: 15px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const MapWrapper = styled.div`
  position: relative; /* 핀을 배치하기 위한 relative 설정 */
  width: 520px;
  height: 520px;
  border: 3px solid #aaa;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
`;

const MapImage = styled.img`
  width: 520px;
  height: 520px;
  // object-fit: center;
  object-fit: cover;
  border: 3px solid #aaa;
  border-radius: 5px;
`;

const Pin = styled.div`
  position: absolute; /* 핀이 지도 위에 위치하도록 설정 */
  width: 20px;
  height: 20px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%); /* 클릭 위치를 중심으로 설정 */
  cursor: pointer;
`;

const RightSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;
  margin-right: 80px;
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: center; /* 가로 가운데 정렬 */
  align-items: center; /* 세로 가운데 정렬 */
  font-size: 1.3rem;
  padding: 10px; /* 내부 여백 추가 */
  border: 2px solid #ccc; /* 직사각형 테두리 */
  border-radius: 5px; /* 테두리 모서리 둥글게 */
  background-color: #ddd; /* 배경색 */
  width: 200px; /* 전체 너비 */
  height: 15px; /* 높이를 설정해 세로 정렬 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  text-align: center; /* 텍스트 정렬 */
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center; /* 핀 번호와 선택 박스 세로 정렬 */
  gap: 10px; /* 간격 */
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 200px; /* 가로 길이 설정 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  background-color: #f9f9f9;
  &:focus {
    outline: none;
    border-color: #007bff; /* 포커스 시 테두리 색상 */
  }
`;

const SaveButton = styled.button`
  padding: 10px;
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

const PinNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%; /* 원 형태 */
  background-color: #007bff; /* 배경색 (파란색) */
  color: white; /* 텍스트 색상 */
  display: flex;
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  font-size: 1rem; /* 글자 크기 */
  font-weight: bold; /* 글자 굵게 */
  margin-right: 10px; /* 번호와 선택 박스 간 간격 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 약간의 그림자 */
`;

const MapCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { latitude, longitude, imageData } = location.state || {};
  const [roomName, setRoomName] = React.useState('짱짱맨');
  const [pins, setPins] = useState([]);

  // 지도 클릭 핸들러
  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect(); // 지도 이미지의 크기와 위치
    const x = e.clientX - rect.left; // 클릭한 X 좌표
    const y = e.clientY - rect.top; // 클릭한 Y 좌표

    // 클릭한 위치를 기준으로 가장 가까운 블록 계산
    const blockX = Math.round((x / rect.width) * 100); // 100x100 블록 기준 X 좌표
    const blockY = Math.round((y / rect.height) * 100); // 100x100 블록 기준 Y 좌표

    // 새로운 핀 추가
    setPins((prevPins) => [
      ...prevPins,
      { id: prevPins.length + 1, blockX, blockY, screenX: x, screenY: y },
    ]);
  };
  // 핀 삭제 핸들러
  const handlePinRemove = (id) => {
    setPins((prevPins) => prevPins.filter((pin) => pin.id !== id)); // 특정 핀 삭제
  };

  const handleMissionChange = (id, value) => {
    setPins((prev) =>
      prev.map((pin) => (pin.id === id ? { ...pin, mission: value } : pin))
    );
  };

  const handleSave = () => {
    console.log('Room Name:', roomName);
    console.log('Pins:', pins);
    // api 호출 로직으로 변경
    navigate('/', { state: { roomName, latitude, longitude, pins } });
  };

  return (
    <Container>
      <Modal>
        <CloseButton onClick={() => navigate(-1)}>X</CloseButton>
        <LeftSection>
          <Title>-Create Session-</Title>
          <Input
            type="text"
            // value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder='맵 이름을 입력해주세요.'
          />
          <MapWrapper onClick={handleMapClick}>
            {imageData ? (
              <MapImage src={imageData} alt="Dynamic Map Preview" />
            ) : (
              <p>맵 이미지를 불러올 수 없습니다.</p>
            )}
            {pins.map((pin) => (
              <Pin
                key={pin.id}
                style={{ left: `${pin.screenX}px`, top: `${pin.screenY}px` }}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 차단
                  handlePinRemove(pin.id); // 핀 삭제
                }}
              >
                {pin.id}
              </Pin>
            ))}
          </MapWrapper>
        </LeftSection>
        <RightSection>
          <LocationInfo>
            <InfoRow>
              <span>위도: </span>
              <span>{latitude}</span>
            </InfoRow>
            <InfoRow>
              <span>경도: </span>
              <span>{longitude}</span>
            </InfoRow>
          </LocationInfo>
          <SelectGroup>
            {pins.map((pin) => (
              <SelectWrapper key={pin.id}>
                <PinNumber>{pin.id}</PinNumber>
                <Select
                  value={pin.mission}
                  onChange={(e) => handleMissionChange(pin.id, e.target.value)}
                >
                  <option value="">미션 선택</option>
                  <option value="최저속도제한">최저속도제한</option>
                  <option value="고속도달">고속도달</option>
                  <option value="탐지">탐지</option>
                </Select>
              </SelectWrapper>
            ))}
          </SelectGroup>
          <SaveButton onClick={handleSave}>저장하기</SaveButton>
        </RightSection>
      </Modal>
    </Container>
  );
};

export default MapCreate;
