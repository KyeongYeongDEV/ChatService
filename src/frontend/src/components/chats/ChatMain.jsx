import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/chat';

const ChatMain = () => {
    const navigate = useNavigate();
    const { userId } = useParams(); 
    const [friends, setFriends] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [userInfo, setUserInfo] = useState({}); 

    useEffect(() => {
        // 로그인된 사용자 정보 가져오기
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${apiUrl}/userinfo`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchUserInfo();

        // 채팅방 목록 가져오기
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get(`${apiUrl}/rooms`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setChatRooms(response.data);
            } catch (error) {
                console.error('채팅방 목록을 가져오는 중 오류 발생:', error);
            }
        };
        fetchChatRooms();
    }, []);

    const handleChatRoomSelect = (chatName, type) => {
        navigate(`/chat/${userId}/chatwindow/${chatName}`);
    };

    const handleCreateChatRoom = async () => {
        try {
            const response = await axios.post(`${apiUrl}/create-room`, {
                u_id: userInfo.u_id,
                other_email: inviteEmail
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                alert('채팅방이 생성되었습니다.');
                setChatRooms([...chatRooms, response.data]);
                setShowModal(false);
            }
        } catch (error) {
            console.error('채팅방 생성 중 오류 발생:', error);
            alert('채팅방을 생성하는데 실패했습니다.');
        }
    };

    return (
        <Container>
            <h2>친구 목록 및 채팅방 목록</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>채팅방 만들기</Button>
            <Tab.Container defaultActiveKey="chatRooms">
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="friends">친구 목록</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="chatRooms">채팅방 목록</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content className="mt-3">
                    <Tab.Pane eventKey="friends">
                        <ListGroup>
                            {friends.map((friend) => (
                                <ListGroup.Item key={friend.id} onClick={() => handleChatRoomSelect(friend.name, 'friend')}>
                                    {friend.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Tab.Pane>
                    <Tab.Pane eventKey="chatRooms">
                        <ListGroup>
                            {chatRooms.map((chatRoom) => (
                                <ListGroup.Item key={chatRoom.id} onClick={() => handleChatRoomSelect(chatRoom.name, 'chatRoom')}>
                                    {chatRoom.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* 채팅방 만들기 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>채팅방 만들기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>초대할 친구 이메일</Form.Label>
                        <Form.Control
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="친구의 이메일을 입력하세요"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
                    <Button variant="primary" onClick={handleCreateChatRoom}>채팅방 만들기</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ChatMain;
