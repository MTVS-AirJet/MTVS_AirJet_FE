import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlus } from 'react-icons/fa';
import logoImage from '../assets/logo.png';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 98vh;
  padding: 10px;
  align-items: flex-start;
  box-sizing: border-box;
  position: relative;
  background-size: 100% 100%;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9); /* 흰색 반투명 오버레이 */
  z-index: 0;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row; /* LeftPanel과 RightPanel이 나란히 배치되도록 설정 */
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 1;
  padding: 15px;
  font-size: 0.85rem;
  margin-left: 100px;
  width: 100%;
  max-width: 800px; /* RightPanel의 최대 너비 제한 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 1.8rem; /* 제목 크기 조정 */
  font-weight: bold;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 1.11rem;
  text-align: center;
  margin-bottom: 15px; /* 간격 조정 */
  border: 2.5px solid #000;
  padding: 8px;
  background-color: white;
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
  border: 5px solid ${(props) => (props.selected ? '#009bff' : '#aaa')};
  border-radius: 5px;
  overflow: hidden;
  width: 300px; /* 크기 축소 */
  height: 320px;
  cursor: pointer;
  transition: border-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    border-color: #000000;
  }
`;

const MapImage = styled.img`
  width: 290px;
  height: 290px;
  object-fit: cover;
  margin-top: 1.5px;
`;

const MapName = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-top: 1px;
`;

const AddMapCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #000;
  border-radius: 5px;
  width: 300px;
  height: 320px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #000;
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
  font-size: 1.2rem;
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
  background-color: white;
  padding: 15px;
  font-size: 0.85rem;
  margin-left: 100px;
  margin-right: 30px;
  width: 100%;
  height: 700px;
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
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DetailText = styled.p`
  font-size: 1rem;
  line-height: 1.2;
  color: #333;
  margin: 3px 0;
`;

const BoldLabel = styled.span`
  font-weight: bold;
  color: #000;
`;



const MapList = () => {
  const navigate = useNavigate();
  // 맵 데이터 샘플
  const mapsData = [
    { id: 1, name: '맵 이름 1', image: logoImage },
    { id: 2, name: '맵 이름 2', image: logoImage },
    { id: 3, name: '맵 이름 3', image: logoImage },
  ];

  // 선택된 맵 상태 관리
  const [selectedMap, setSelectedMap] = useState(mapsData[0]);

  return (
    <Container style={{ backgroundImage: `url(${logoImage})` }}>
      <Overlay />
      <Content>
      <LeftPanel>
        <Title>Map List</Title>
        <Description>
          현재 플레이할 수 있는 맵 목록입니다. 새롭게 만들거나, 기존의 맵을 응용할 수 있습니다.
        </Description>
        <MapGrid>
          {mapsData.map((map) => (
            console.log('Rendering MapCard:', map.name),
            <MapCard
              key={map.id}
              selected={map.id === selectedMap.id}
              onClick={() => {
                console.log('Selected map:', map);
                setSelectedMap(map)}} // 선택된 맵 상태 갱신
            >
              <MapImage src={map.image} alt={map.name} />
              <MapName>{map.name}</MapName>
            </MapCard>
          ))}
          <AddMapCard onClick={() => navigate('/map/search')}>
            <FaPlus />
          </AddMapCard>
        </MapGrid>
        <NavigationButtons>
          <NavButton>
            <FaArrowLeft />
          </NavButton>
          <NavButton>
            <FaArrowRight />
          </NavButton>
        </NavigationButtons>
      </LeftPanel>

      {/* RightPanel에서 선택된 맵 데이터 사용 */}
      <RightPanel>
        <MapDetailImage src={selectedMap.image} alt={selectedMap.name} />
        <DetailText>
          <BoldLabel>맵 이름:</BoldLabel> {selectedMap.name}
        </DetailText>
        <DetailText>
          <BoldLabel>제작자:</BoldLabel> 홍길동
        </DetailText>
        <DetailText>
          <BoldLabel>맵 설명:</BoldLabel> 을왕리에서 전투를
        </DetailText>
        <DetailText>
          <BoldLabel>위도:</BoldLabel> 37.4477331
        </DetailText>
        <DetailText>
          <BoldLabel>경도:</BoldLabel> 126.3725042
        </DetailText>
        <DetailText>
          <BoldLabel>수행해야 하는 미션:</BoldLabel> 을왕리 전투 상황
        </DetailText>
      </RightPanel>
      </Content>
    </Container>
  );
};

export default MapList;