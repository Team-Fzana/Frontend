import { useEffect } from "react";

import UncheckBoxIcon from "@/assets/UncheckBoxIcon.svg";
import CheckedBoxIcon from "@/assets/CheckedBoxIcon.svg";
import { useStore } from "@/store";

const TodoListComponent_Friend = ({ className }) => {
  const todos = useStore((state) => state.schedules) || []; // store에서 todos 가져오기
  const memberId = useStore((state) => state.memberId);
  const fetchSchedules = useStore((state) => state.fetchSchedules);
  const setSchedules = useStore((state) => state.setSchedules); // setSchedules를 올바르게 가져오기

  useEffect(() => {
    console.log("memberId:", memberId); // memberId를 로그로 출력
    console.log("Updated Schedules:", todos);

    if (memberId) {
      fetchSchedules(memberId)
        .then(() => {
          // fetchSchedules는 void를 반환하므로 별도 처리 불필요
        })
        .catch((error) => {
          console.error("Error fetching schedules:", error);
        });
    }
  }, [memberId, fetchSchedules, setSchedules]);

  return (
    <div className={`${className} `}>
      <div className="flex justify-between items-center p-2.5">
        <div className="text-lg text-gray585151 font-bold pl-1">Todos</div>
      </div>

      <ul className="divide-y divide-gray-300 mx-4">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id} className="flex items-center py-3 pl-2 pr-2 relative">
              {/* 체크박스 */}
              <img
                src={todo.checkStatus === 1 ? CheckedBoxIcon : UncheckBoxIcon}
                alt={todo.checkStatus === 1 ? "Todo completed" : "Mark todo as completed"}
                className="cursor-pointer"
              />

              {/* Todo 텍스트 */}
              <span className={todo.completed ? "ml-2 line-through" : "ml-2"}>{todo.content}</span>
            </li>
          ))
        ) : (
          <li className="text-center py-3 text-gray-500">할 일이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default TodoListComponent_Friend;
