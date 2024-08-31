import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function RegistrationForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhoneCode, setConfirmPhoneCode] = useState('');
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  let passCodeCertification = 0;

  const apiUrl = "http://localhost:8080/api/auth"
  const navigate = useNavigate();

  const handlerName =(e)=>{
    e.preventDefault();
    setName(e.target.value);
    console.log(name);
  };
  const handlerUserId = (e)=>{
    e.preventDefault();
    setUserId(e.target.value)
  };
  const handlerUserPw = (e)=>{
    e.preventDefault();
    setUserPw(e.target.value)
  };
  const handlerEmail = (e)=>{
    e.preventDefault();
    setEmail(e.target.value)
  };
  const handlePhoneNumber = (e)=>{
    e.preventDefault();
    setPhoneNumber(e.target.value);
  }
  const handleConfirmPCode = (e)=>{
    e.preventDefault();
    setConfirmPhoneCode(e.target.value);
  }
  const handlerComfirmPassword = (e)=>{
    e.preventDefault();
    setConfirmPassword(e.target.value)
  };
  const handlerCode = (e)=>{
    e.preventDefault();
    setCode(e.target.value)
  };

  const handleSubmit = async (e) => {
    try{
      // if(userId.length === 0 || userPw.length === 0 || name.length === 0 
      //   ||email.length === 0 || handlerComfirmPassword.length === 0){
      //   alert("빈칸을 모두 입력해주세요!");
      // }else if(userPw !== confirmPassword) {
      //   alert("비밀번호와 확인이 일치하지 않습니다")
      // }
  
      const data = {
        email : email,
        password : userPw,
        name : name
      }
      const res = await axios.post(apiUrl+"/join",data)

      if(res.status === 200){
        alert(res.data.msg)
        navigate('/login')
      }else if( res.status === 404){
        throw new Error();
      }
    }catch(err){
      alert(err)
    }
  };
  const handleSendEmailCode = async(e)=>{
    try{
      e.preventDefault();
    
      const res = await axios.post(apiUrl + "/code",{
        userEmail : email
      })

      alert(res.data.msg);
    }catch(err){
      alert(err);
    }
  };
  const handleConfirmCode = async(e)=>{
    try{
      e.preventDefault();

      const data = {
        userInputCode : code,
        userEmail : email
      }
      const res = await axios.post(apiUrl + "/code/verify" , data);

      if(res.status === 200){
        passCodeCertification = 1
        alert(res.data.msg)  
      }else{
        throw new Error(res.data.msg);
      }
    }catch(err){
      alert(err)
    }
  }
  const handleConfirmeCode = async(e)=>{
    //핸드폰 인증
  };

  return (
    <div className="container mt-5">
      <h2>회원가입</h2>
      <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            placeholder="이름를 입력하세요"
            value={name}
        onChange={handlerName}
          />
        </Form.Group>
      
        {/* <Form.Group controlId="formUserId" className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="아이디를 입력하세요"
            value={userId}
        onChange={handlerUserId}
          />
        </Form.Group> */}
        
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>이메일 주소</Form.Label>
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={handlerEmail}
              />
            </Col>
            {/* <Col xs={3} className="text-end">
              <Button variant="primary" type="button" className="w-100" onClick={handleSendEmailCode}>
                인증 코드 발송
              </Button>
            </Col> */}
          </Row>
        </Form.Group> 
        {/* <Form.Group controlId="formCode" className="mb-3">
          
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                placeholder="인증코드를 입력하세요"
                value={code}
                onChange={handlerCode}
              />
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="primary" type="button" className="w-100" onClick={handleConfirmCode}>
                확인
              </Button>
            </Col>
          </Row>
        </Form.Group> */}
{/* 
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>핸드폰 번호 ('-' 제외 입력)</Form.Label>
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                placeholder="핸드폰 번호를 입력하세요"
                value={phoneNumber}
                onChange={handlePhoneNumber}
              />
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="primary" type="button" className="w-100" onClick={handleConfirmPCode}>
                인증 코드 발송
              </Button>
            </Col>
          </Row>
        </Form.Group>  */}

        {/* <Form.Group controlId="formCode" className="mb-3">
          
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                placeholder="인증코드를 입력하세요"
                value={confirmPhoneCode}
                onChange={handleConfirmeCode}
              />
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="primary" type="button" className="w-100" onClick={handleConfirmCode}>
                확인
              </Button>
            </Col>
          </Row>
        </Form.Group> */}
        
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="userPw"
            placeholder="비밀번호를 입력하세요"
            value={userPw}
            onChange={handlerUserPw}
          />
        </Form.Group>

        {/* <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={handlerComfirmPassword}
          />
        </Form.Group> */}

        <Button variant="primary" type="submit" className="mt-3" onClick={handleSubmit}>
          회원가입
        </Button>
      
    </div>
  );
}

export default RegistrationForm;
