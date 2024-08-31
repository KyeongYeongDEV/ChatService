import React from 'react';
import { Container, Nav, Tab, ListGroup } from 'react-bootstrap';
import {useNavigate,  useParams} from "react-router-dom"

//TODO: 데이터를 back에서 받아온다 => 받아온 데이터로 불러온다
// 샘플 데이터
const friends = [
{ id: 1, name: 'Alice' },
{ id: 2, name: 'Bob' },
{ id: 3, name: 'Charlie' },
];

const chatRooms = [
{ id: 1, name: 'Alice' },
{ id: 2, name: 'Project Group' },
{ id: 3, name: 'Family' },
];

const signedUser = "cky"
const ChatMain = () => {
    const navigate = useNavigate()
    
    const { userId } = useParams(); // useParams를 통해 username 파라미터를 가져옴
    const handleChatRoomSelect = (chatName, type) => {
        navigate(`/chat/${userId}/chatwindow/${chatName}`);
    };

    return (
        <Container>
        <h2>친구 목록 및 채팅방 목록</h2>
        <Tab.Container defaultActiveKey="friends">
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
        </Container>
    );
};

export default ChatMain;
