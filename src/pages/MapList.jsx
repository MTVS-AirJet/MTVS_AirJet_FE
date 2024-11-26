import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlus, FaCopy } from 'react-icons/fa';
import logoImage from '../assets/back.jpg';
import axios from 'axios';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 98vh;
  padding: 10px;
  align-items: flex-start;
  box-sizing: border-box;
  position: relative;
  background-image: url('${logoImage}');
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    flex-direction: column; /* 작은 화면에서는 세로 배치 */
    height: auto;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* 흰색 반투명 오버레이 */
  z-index: 0;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row; /* 기본적으로 LeftPanel과 RightPanel을 가로로 배치 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  width: 90%; /* 기본 너비를 90%로 설정 */
  max-width: 15000px; /* 최대 너비 제한 */
  margin: 0 auto; /* 화면 중앙 정렬 */
  height: 100%; /* 부모의 높이에 맞춤 */
  min-height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */

  @media (max-width: 1024px) {
    flex-direction: column; /* 태블릿 이하에서는 세로 배치 */
    width: 95%; /* 너비를 약간 더 확장 */
  }

  @media (max-width: 768px) {
    flex-direction: column; /* 모바일에서는 세로 배치 */
    width: 100%; /* 모바일 화면에 맞춰 너비 100% */
    padding: 10px; /* 좌우 여백 추가 */
  }
`;
const LeftPanel = styled.div`
  flex: 1;
  padding: 15px;
  font-size: 0.85rem;
  margin-left: 100px;
  width: 100%;
  margin-top: -20px;
  max-width: 800px; /* RightPanel의 최대 너비 제한 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  @media (max-width: 768px) {
    margin: 0; /* 모바일에서 마진 제거 */
    width: 100%; /* 가로폭 꽉 채우기 */
  }
`;

const Title = styled.h1`
  font-size: 2.5rem; /* 제목 크기 조정 */
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 1.11rem;
  text-align: center;
  margin-bottom: 5px; /* 간격 조정 */
  border: 2.5px solid #000;
  padding: 8px;
  background-color: #ebebeb;
  width: 80%;
  font-weight: bold;
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px; /* 간격을 줄여 공간 확보 */
  justify-items: center;
`;

const MapCard = styled.div`
  border: 7px solid ${(props) => (props.selected ? '#009aaa' : '#aaa')};
  border-radius: 10px;
  overflow: hidden;
  width: 290px; /* 크기 축소 */
  height: 300px;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s, opacity 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => (props.selected ? 'rgba(0, 0, 0, 0.5)' : 'white')};
  opacity: ${(props) => (props.selected ? 0.8 : 1)}; /* 선택되면 전체 어둡게 */
  &:hover {
    border-color: #009eee;
  }
`;

const MapImage = styled.img`
  width: 270px;
  height: 270px;
  object-fit: cover;
  margin-top: 3px;
  opacity: 1;
`;

const MapName = styled.p`
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  margin-top: 1px;
  opacity: 1;
`;

const AddMapCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed #000;
  border-radius: 5px;
  width: 300px;
  height: 300px;
  cursor: pointer;
  font-size:10rem;
  color: #009aaa;
  transition: color 0.3s;
  &:hover {
    color: #007bff;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  margin: 0 5px;
  color: #555;
  &:hover {
    color: #000;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  border: 3px solid #000;
  background-color: #ebebeb;
  padding: 15px;
  font-size: 0.85rem;
  margin-left: 100px;
  margin-right: 30px;
  width: 100%;
  height: 720px;
  max-width: 700px; /* RightPanel의 최대 너비 제한 */
  margin-top: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

const MapDetailImage = styled.img`
  width: 400px;
  height: 400px; /* 이미지 크기를 줄여 공간 확보 */
  object-fit: cover;
  border: 5px solid #000;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DetailText = styled.p`
  font-size: 1.2rem;
  line-height: 1.2;
  color: #333;
  margin: 3px 0;
`;

const BoldLabel = styled.span`
  font-weight: bold;
  color: #000;
`;

const CopyButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    background-color: #0056b3;
  }
`;



const MapList = () => {
  const navigate = useNavigate();
  const [mapsData, setMapsData] = useState([]); // 맵 데이터 상태
  const [selectedMap, setSelectedMap] = useState(null); // 선택된 맵 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [pageSize, setPageSize] = useState(3); // 페이지 크기

  // 데이터 가져오기
  const fetchData = async (page = 0, size = 3) => {
    try {
      const response = await axios.get(`http://43.202.221.239/api/map/all`, {
        params: { page, size }, // 쿼리 파라미터 추가
      });
      if (response.data.success) {
        setMapsData(response.data.response.content);
        setSelectedMap(response.data.response.content[0]); // 첫 번째 맵 선택
      }
    } catch (error) {
      console.error('맵 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
  };
  
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);
  
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 맵 이름 복사 로직
  const handleCopyText = () => {
    if (!selectedMap) return;

    const textArea = document.createElement('textarea');
    textArea.value = selectedMap.mapName;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 선택 범위 설정

    try {
      document.execCommand('copy'); // 텍스트 복사
      alert(`맵 이름이 복사되었습니다! 맵 이름: ${selectedMap.mapName}`);
    } catch (err) {
      console.error('복사 실패:', err); // 복사 실패 시 오류 출력
    }

    document.body.removeChild(textArea); // 텍스트 영역 제거
  };

  return (
    <Container>
      <Overlay />
      <Content>
        <LeftPanel>
          <Title>Map List</Title>
          <Description>
            현재 플레이할 수 있는 맵 목록입니다. <br />
            새롭게 만들거나, 기존의 맵을 응용할 수 있습니다.
          </Description>
          <MapGrid>
            {mapsData.map((map) => (
              <MapCard
                key={map.id}
                selected={selectedMap && map.id === selectedMap.id}
                onClick={() => setSelectedMap(map)} // 선택된 맵 상태 갱신
              >
                <MapImage
                  src={`${map.mapImage}`}
                  alt={map.mapName}
                />
                <MapName>{map.mapName}</MapName>
              </MapCard>
            ))}
            <AddMapCard onClick={() => navigate('/map/search')}>
              <FaPlus />
            </AddMapCard>
          </MapGrid>
          <NavigationButtons>
            <NavButton onClick={() => handlePageChange("prev")}>
              <FaArrowLeft />
            </NavButton>
            <NavButton onClick={() => handlePageChange("next")}>
              <FaArrowRight />
            </NavButton>
          </NavigationButtons>
        </LeftPanel>

        {/* RightPanel에서 선택된 맵 데이터 사용 */}
        {selectedMap && (
          <RightPanel>
            <MapDetailImage
              src={`${selectedMap.mapImage}`}
              alt={selectedMap.mapName}
            />
            <DetailText>
              <BoldLabel>맵 이름:</BoldLabel> {selectedMap.mapName}
            </DetailText>
            <DetailText>
              <BoldLabel>제작자:</BoldLabel> {selectedMap.producer}
            </DetailText>
            <DetailText>
              <BoldLabel>위도:</BoldLabel> {selectedMap.latitude}
            </DetailText>
            <DetailText>
              <BoldLabel>경도:</BoldLabel> {selectedMap.longitude}
            </DetailText>
            <CopyButton onClick={handleCopyText}>
              <FaCopy /> 맵 이름 복사
            </CopyButton>
          </RightPanel>
        )}
      </Content>
    </Container>
  );
};

export default MapList;
