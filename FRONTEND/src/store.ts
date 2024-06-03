import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Follow {
  followingId: number;
  name: string;
}

interface Follower {
  followerId: number;
  name: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface Routine {
  id: number;
  title: string;
  description: string;
  frequency: string;
  nextRun: string;
}

interface Schedule {
  id: number;
  content: string;
  checkStatus: number;
  thisDay: string;
  startTime: string;
  endTime: string;
  completed?: boolean;
}

interface Member {
  id: number;
  email: string;
  nickName: string;
  introduce: string;
  profileUrl: string;
}

interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  bio: string;
  profilePic: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (profilePic: string) => void;
  signUp: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

interface AppState {
  memberId: number | null;
  schedules: Schedule[];
  goals: Goal[];
  routines: Routine[];
  followings: Follow[];
  followers: Follower[];
  members: Member[];
  setMemberId: (memberId: number) => void;
  setSchedules: (schedules: Schedule[]) => void;
  setGoals: (goals: Goal[]) => void;
  setRoutines: (routines: Routine[]) => void;
  setFollowings: (followings: Follow[]) => void;
  setFollowers: (followers: Follower[]) => void;
  setMembers: (members: Member[]) => void;
  fetchSchedules: (memberId: number) => Promise<void>;
  fetchGoals: (memberId: number) => Promise<void>;
  fetchRoutines: (memberId: number) => Promise<void>;
  fetchFollowings: (memberId: number) => Promise<void>;
  fetchFollowers: (memberId: number) => Promise<void>;
  fetchMembers: (query: string) => Promise<void>;
  addTodo: (memberId: number, newTodo: Omit<Schedule, "id">) => Promise<void>;
}

interface ModalState {
  isFriendSearchOpen: boolean;
  setFriendSearchOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
}

export const useStore = create(
  persist<SignUpState & AppState & ModalState>(
    (set, get) => ({
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      bio: "",
      profilePic: "",
      memberId: null,
      schedules: [],
      goals: [],
      routines: [],
      followings: [],
      followers: [],
      members: [],
      isFriendSearchOpen: false,
      setFriendSearchOpen: (isOpen) => set({ isFriendSearchOpen: isOpen }),
      isSettingsOpen: false,
      setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
      setNickname: (nickname) => set({ nickname }),
      setBio: (bio) => set({ bio }),
      setProfilePic: (profilePic) => set({ profilePic }),
      setMemberId: (memberId) => set({ memberId }),
      setSchedules: (schedules) => set({ schedules }),
      setGoals: (goals) => set({ goals }),
      setRoutines: (routines) => set({ routines }),
      setFollowings: (followings) => set({ followings }),
      setFollowers: (followers) => set({ followers }),
      setMembers: (members) => set({ members }),

      signUp: async () => {
        const { email, password, bio, nickname, profilePic } = get();

        const requestBody = {
          email,
          password,
          introduce: bio,
          nickName: nickname,
          memberPhoto: profilePic,
        };

        try {
          const response = await fetch("http://localhost:8080/api/v1/members/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error("회원가입 실패");
          }

          const data = await response.json();
          console.log("회원가입 성공:", data);
          set({
            email: "",
            password: "",
            confirmPassword: "",
            nickname: "",
            bio: "",
            profilePic: "",
          });
        } catch (error) {
          console.error("Error:", error);
          alert("회원가입 실패");
        }
      },

      login: async (email: string, password: string) => {
        const params = new URLSearchParams({
          email,
          password,
        });

        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/members/login?${params.toString()}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("로그인 실패");
          }

          const data = await response.json();
          console.log("로그인 성공:", data);

          // 로그인 성공 시 memberId를 설정
          set({ memberId: data.id });
          console.log("memberId after login:", data.id);
        } catch (error) {
          console.error("Error:", error);
          alert("로그인 실패");
        }
      },

      fetchSchedules: async (memberId: number): Promise<void> => {
        try {
          const response = await fetch(`/api/v1/calendar/${memberId}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch schedules: ${response.statusText}`);
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Expected JSON response");
          }

          const data: Schedule[] = await response.json();
          set({ schedules: data || [] }); // data가 undefined일 경우 빈 배열 설정
        } catch (error) {
          console.error("Failed to fetch schedules:", error);
          set({ schedules: [] }); // 에러 발생 시 빈 배열 설정
        }
      },

      fetchGoals: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/goal/${memberId}`);
          const data = await response.json();
          set({ goals: data });
        } catch (error) {
          console.error("Failed to fetch goals:", error);
        }
      },

      fetchRoutines: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/routines/${memberId}`);
          const data = await response.json();
          set({ routines: data });
        } catch (error) {
          console.error("Failed to fetch routines:", error);
        }
      },

      fetchFollowings: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/follow/${memberId}/following`);
          const data = await response.json();
          set({ followings: data.friends });
        } catch (error) {
          console.error("Failed to fetch followings:", error);
        }
      },

      fetchFollowers: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/follow/${memberId}/followers`);
          const data = await response.json();
          set({ followers: data.followers });
        } catch (error) {
          console.error("Failed to fetch followers:", error);
        }
      },

      fetchMembers: async (query: string) => {
        try {
          const response = await fetch(`/api/v1/members/search?nickNameOrEmail=${query}`);
          const data = await response.json();
          set({ members: data });
        } catch (error) {
          console.error("Failed to fetch members:", error);
        }
      },

      addTodo: async (memberId: number, newTodo: Omit<Schedule, "id">) => {
        try {
          const response = await fetch(`/api/v1/member/${memberId}/schedule`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTodo),
          });

          if (!response.ok) {
            throw new Error("Failed to add todo");
          }

          const data = await response.json();
          set((state) => ({
            schedules: [...state.schedules, { ...data, id: data.id }],
          }));
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to add todo");
        }
      },
    }),
    {
      name: "app-storage", // 이름은 아무거나 설정 가능
      getStorage: () => localStorage, // 기본 저장소를 localStorage로 설정
    }
  )
);
