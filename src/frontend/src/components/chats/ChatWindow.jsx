import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Row, Col, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가

const ChatWindow = () => {
    const { userId, chatName } = useParams(); // useParams를 통해 userId 및 chatName 파라미터를 가져옴
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 초기화

    const [messages, setMessages] = useState([
        { id: 1, text: '안녕하세요!', sender: 'Alice' },
        { id: 2, text: '안녕하세요! 어떻게 지내세요?', sender: 'You' },
        { id: 3, text: '잘 지내고 있어요. 당신은요?', sender: 'Alice' },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const chatWindowRef = useRef(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'You' }]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const onBack = () => {
        navigate(`/chat/${userId}/main`); // 이전 페이지로 이동
    };

    return (
        <Container>
            <Button onClick={onBack} variant="secondary" className="mb-3">
                뒤로가기
            </Button>
            <h2>{chatName}와의 채팅</h2> {/* chatName을 사용하여 제목을 설정 */}
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-bubble ${msg.sender === 'You' ? 'me' : 'other'}`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>
            <Form onSubmit={handleSendMessage}>
                <Row>
                    <Col xs={10}>
                        <Form.Group controlId="formMessage">
                            <Form.Control
                                type="text"
                                placeholder="메시지를 입력하세요"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={2}>
                        <Button variant="primary" type="submit" className="w-100">
                            전송
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default ChatWindow;
