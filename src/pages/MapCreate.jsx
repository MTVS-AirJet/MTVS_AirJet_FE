import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../assets/back.jpg';
import axios from 'axios';

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
  font-size: 2.1rem;
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
  background-color: ${(props) => (props.isStartPin ? 'green' : 'red')};
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

const Lines = styled.svg`
  position: absolute; /* 맵 위에 겹치도록 설정 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 선 위에 마우스 이벤트가 발생하지 않도록 설정 */
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
  font-size: 1.05rem;
  padding: 10px; /* 내부 여백 추가 */
  border: 2px solid #ccc; /* 직사각형 테두리 */
  border-radius: 5px; /* 테두리 모서리 둥글게 */
  background-color: #ddd; /* 배경색 */
  width: 320px; /* 전체 너비 */
  height: 15px; /* 높이를 설정해 세로 정렬 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 약간의 그림자 */
  text-align: center; /* 텍스트 정렬 */
  font-weight: bold;
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
  const [roomName, setRoomName] = React.useState('');
  const [pins, setPins] = useState([]);

  // 지도 클릭 핸들러
  const handleMapClick = (e) => {
    if (pins.length >= 5) {
      alert('최대 5개의 핀만 생성할 수 있습니다.');
      return;
    }
    const rect = e.target.getBoundingClientRect(); // 지도 이미지의 크기와 위치
    const x = e.clientX - rect.left; // 클릭한 X 좌표
    const y = e.clientY - rect.top; // 클릭한 Y 좌표

   // Y 값을 반대로 변환
    const adjustedY = rect.height - y;

    const blockX = Math.round((x / rect.width) * 100); // 블록 단위 X
    const blockY = Math.round((adjustedY / rect.height) * 100); // 블록 단위 Y

    // 새로운 핀 추가
    setPins((prevPins) => [
      ...prevPins,
      { id: prevPins.length + 1, 
        blockX, 
        blockY, 
        screenX: x, 
        screenY: y,
        commandNo: prevPins.length === 0 ? "0" : "-1", // 기본 미션 선택 번호
        },
    ]);
  };

    // 핀 삭제 핸들러
    const handlePinRemove = (id) => {
    setPins((prevPins) => {
      // 특정 핀 삭제 후 나머지 핀들의 id를 재정렬
      const updatedPins = prevPins.filter((pin) => pin.id !== id);
      return updatedPins.map((pin, index) => ({
        ...pin,
        id: index + 1, // 새롭게 1부터 번호 재배정
      }));
    });
  };

  const handleMissionChange = (id, value) => {
    setPins((prev) =>
      prev.map((pin) => (pin.id === id ? { ...pin, commandNo: value } : pin))
    );
  };

  //  저장 버튼 
  const handleSave = async () => {
  // 맵 이름 확인
  if (!roomName.trim()) {
    alert("맵 이름을 입력해주세요.");
    return;
  }

  if (pins.length === 0) {
    alert("핀을 최소 1개 이상 추가해주세요.");
    return;
  }

  // 미션 선택 여부 확인
  const unselectedMission = pins.find((pin) => pin.commandNo === "-1");
  if (unselectedMission) {
    alert(`핀 번호 ${unselectedMission.id}의 미션을 선택해주세요.`);
    return;
  }
    const formData = new FormData();

    // Create the mapDTO object
    const mapData = {
      mapName: roomName,
      latitude: latitude || 0, // Default to 0 if undefined
      longitude: longitude || 0,
      producer: "제작자", // Replace with a dynamic value if needed
      mission: pins.map((pin) => ({
        pinNo: pin.id - 2, 
        x: pin.blockX,
        y: pin.blockY,
        commandNo: parseInt(pin.commandNo, 10), // 미션 번호를 정수로 변환
      })),
    };
    formData.append(
      "dto", // 서버에서 받을 필드 이름
      new Blob([JSON.stringify(mapData)], { type: "application/json" }) // JSON 데이터를 Blob으로 변환
    );

    //   // Append image file (fetch the server image as a blob)
    // const imageBlob = await fetch(logoImage).then((res) => res.blob()); // 서버 이미지 URL 사용
    // formData.append("file", imageBlob, "mapImage.jpg"); // 서버에서 받을 필드 이름: file

      // Google Static Map 이미지 Blob으로 변환
    const staticMapUrl = getStaticMapUrl(latitude, longitude, 14); // zoomLevel은 필요에 따라 조정
    const imageBlob = await fetch(staticMapUrl).then((res) => res.blob());
    formData.append("file", imageBlob, "staticMap.jpg");
  
    try {
      // Send POST request to the server
      const response = await axios.post("http://43.202.221.239/api/map/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Log server response
      console.log("Server Response:", response.data);
      alert("맵 저장 성공!");
      navigate("/"); // '/' 경로로 리다이렉트
    } catch (error) {
      // Handle errors
      console.error("Error during POST request:", error.response?.data || error.message);
      alert("Failed to save map.");
    }
  };

  const getStaticMapUrl = (lat, lng, zoomLevel) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const size = '640x640';
    const mapType = 'satellite';

    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoomLevel}&size=${size}&maptype=${mapType}&key=${apiKey}`;
  };
  

  return (
    <Container>
      <Modal>
        <CloseButton onClick={() => navigate(-1)}>X</CloseButton>
        <LeftSection>
          <Title>-Create Session-</Title>
          <Input
            type="text"
            onChange={(e) => setRoomName(e.target.value)}
            placeholder='맵 이름을 입력해주세요.'
          />
          <MapWrapper onClick={handleMapClick}>
            {imageData ? (
              <MapImage src={imageData} alt="Dynamic Map Preview" />
            ) : (
              <p>맵 이미지를 불러올 수 없습니다.</p>
            )}
            <Lines>
              <polyline
                points={pins.map((pin) => `${pin.screenX},${pin.screenY}`).join(' ')}
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
            </Lines>
            {pins.map((pin, index) => (
              <Pin
                key={pin.id}
                style={{ left: `${pin.screenX}px`, top: `${pin.screenY}px` }}
                isStartPin={index === 0}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 차단
                  handlePinRemove(pin.id); // 핀 삭제
                }}
              >
                {index === 0 ? 'S' : index} {/* 1번 핀은 'S', 나머지는 번호 */}
              </Pin>
            ))}
          </MapWrapper>
        </LeftSection>
        <RightSection>
          <LocationInfo>
            <InfoRow>
              <span>지도를 클릭하면 핀이 생성됩니다.</span>
            </InfoRow>
            <InfoRow>
              <span>핀을 클릭하면 핀이 삭제됩니다.</span>
            </InfoRow>
          </LocationInfo>
          <SelectGroup>
            {pins.map((pin, index) => (
              <SelectWrapper key={pin.id}>
                <PinNumber>{index === 0 ? 'S' : index}</PinNumber>
                <Select
                  value={pin.commandNo}
                  onChange={(e) => handleMissionChange(pin.id, e.target.value)}
                >
                  {index === 0 ? (
                    // 1번 핀: 이륙만 선택 가능
                    <>
                      <option value="0">이륙</option>
                    </>
                  ) : (
                    // 2번 핀부터: 이륙 제외한 옵션만 표시
                    <>
                      <option value="-1">미션 선택</option>
                      <option value="1">편대 비행</option>
                      <option value="2">공대지 미사일</option>
                    </>
                  )}
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
