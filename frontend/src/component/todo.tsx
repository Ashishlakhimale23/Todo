
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/axiosroutes";
interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

function Todo() {
  const authcontext = useContext(AuthContext);
  const { settoken, setLogged } = authcontext;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();
  const navigator = useNavigate();
  
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const authtoken: string | null = localStorage.getItem("authtoken");
    console.log(authtoken);
    if (authtoken == null) {
      setLogged(false);
    } else {
      settoken(authtoken);
    }
  }, [setLogged, settoken]);


  const fetchTodos = async () => {
    const response = await api.get(`/todo/getalltodos`);
    return response.data.data.todos;
  };

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => api.post(`/todo/deletetodo`,  { deleteid: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodoMutation = useMutation({
    mutationFn: (newTodo: { title: string; description: string , completed:boolean }) => api.post(`/todo/createtodo`, newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: (changes:{id: string ; result : boolean}) => api.post(`/todo/changestatus`, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("authtoken");
    localStorage.removeItem("refreshtoken");
    setLogged(false)
    navigator("/login");
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-4 space-y-4">
      <div className="flex justify-between">
        <label htmlFor="" className="text-3xl font-semibold">
          Task's
        </label>
        <button className="bg-red-700 text-white py-2 px-3 font-medium rounded-md" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="flex space-x-2">
        <div className="flex flex-col h-fit w-96 p-4 bg-black space-y-4 rounded-md">
          <label htmlFor="" className="text-white">
            Title
          </label>
          <input
            type="text"
            className="py-2 px-2 rounded-md outline-none"
            value={title}
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <label htmlFor="" className="text-white">
            Description
          </label>
          <input
            type="text"
            className="py-2 px-2 rounded-md outline-none"
            value={description}
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <button
            className="text-white"
            onClick={() => {
              if (title === "" || description === "") {
                return;
              }
              const completed = false
              addTodoMutation.mutate({ title, description, completed});
              setTitle("");
              setDescription("");
            }}
          >
            Add Task
          </button>
        </div>
        <div className="grow">
          {todos ? (
            <ul className="space-y-2">
              {todos.map((t: Todo, index: number) => (
                <li
                  key={t._id}
                  className="p-3 text-white rounded-md flex justify-between"
                  style={t.completed ? { backgroundColor: "green" } : { backgroundColor: "black" }}
                  ref={(el) => (itemRefs.current[index] = el)}
                >
                  <span>
                    <strong>{t.title}</strong> : {t.description}
                  </span>
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                      onClick={() =>{ 
                        const color = itemRefs.current[index]?.style.backgroundColor
                        const result:boolean = color =="green" 
                        const id = t._id
                         changeStatusMutation.mutate({id,result})}}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                      onClick={() => deleteTodoMutation.mutate(t._id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
