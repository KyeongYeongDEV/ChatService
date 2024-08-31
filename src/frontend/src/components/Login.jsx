import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import axios from 'axios';



function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userPw, setUserPw] = useState('');
  const [aToken, setAToken] = useState('');

  const apiUrl = "http://localhost:8080/api/auth";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await axios.post(apiUrl + "/login", {
      u_email : userEmail,
      u_password : userPw
    });

    if(res.status === 200){
      setAToken(res.data.accessToken);
      alert(res.data.msg)
      navigate(`/chat/${userEmail}/main`);
      
    }else if(res.status === 404){
      alert(res.data.err)
    }
  };

  return (
    (aToken === ""?<>
    <div className="container">
      <h2>로그인</h2>
    
      <Form.Group controlId="formId">
        <Form.Label>아이디</Form.Label>
        <Form.Control
          type="id"
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

      <Button variant="primary" type="submit" className="mt-3" onClick = {handleSubmit}>
        로그인
      </Button>
    </div>
    </>:
    navigate("/home")
    )
  );
}

export default Login;