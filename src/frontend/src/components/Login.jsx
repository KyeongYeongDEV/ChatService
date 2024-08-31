import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [aToken, setAToken] = useState('');

  const apiUrl = "http://localhost:8080/api/auth";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(apiUrl + "/login", {
        u_email: userEmail,
        u_password: userPw
      });

      if (res.status === 200) {
        const accessToken = res.data.accessToken;
        setAToken(accessToken);

        // LocalStorage에 accessToken 저장
        localStorage.setItem('accessToken', accessToken);
        const testAccessToken = localStorage.getItem('accessToken');

        // 가져온 토큰을 콘솔에 출력해보기
        console.log("Retrieved Access Token:", testAccessToken);
        alert(res.data.msg);
        navigate(`/chat/${userEmail}/main`);
      } else if (res.status === 404) {
        alert(res.data.err);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
    
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formId">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="email"
            placeholder="아이디를 입력하세요"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          로그인
        </Button>
      </Form>
    </div>
  );
}

export default Login;
