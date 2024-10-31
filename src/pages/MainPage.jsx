import React from 'react';
import logo from '../assets/logo.png';
import '../App.css';

function MainPage() {
    const textToCopy = "몰타_섬";
  
    const handleCopyText = () => {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert("맵 이름이 복사되었습니다! 맵 이름: 몰타_섬\n화면을 종료하고 맵 생성 페이지로 돌아가주세요."); // 성공 메시지
        })
        .catch((error) => {
          console.error("복사 실패:", error);
        });
    };
  
    return (
      <>
        <div>
          <a href="/" target="_blank">
            <img src={logo} className="logo react" alt="Vite logo" />
          </a>
        </div>
        <h1>AirJet</h1>
        <div className="card">
          <button onClick={handleCopyText}>
            맵 이름 복사
          </button>
          <p>
            AirJet Project FE main page
          </p>
        </div>
      </>
    );
}

export default MainPage;