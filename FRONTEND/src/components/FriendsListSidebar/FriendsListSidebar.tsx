// 이 컴포넌트는 친구리스트를 렌더링하는 왼쪽 사이드바 컴포넌트 입니다.
// 이 컴포넌트 안에 (위에서부터) 로고, 오늘 날짜, 친구 목록, 다음 페이지로 넘기는 버튼이 렌더링 되어야 합니다.

import React from "react";
import FriendComponent from "./FriendComponent";
import RestTasksComponent from "./RestTasksComponent";
import LogoComponent from "./LogoComponent";
import NextPageComponent from "./NextPageComponent";
import FriendsListComponent from "./FriendsListComponent";

const FriendsListSidebar = () => (
  <div className="bg-EDEEEE">
    <div>
      <LogoComponent />
    </div>
    <div>
      <RestTasksComponent tasksCount={7} />
    </div>
    <div>
      <FriendsListComponent numFriends={5} />
    </div>
    <div>
      <NextPageComponent />
    </div>
  </div>
);

export default FriendsListSidebar;