import { useEffect, useState, Fragment } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  createStyles,
  useMantineTheme,
  Group,
  Center,
  Stack,
  Input,
  Button,
  Checkbox,
  Title
} from "@mantine/core";

export default function HomePage() {
  // toDo: an array of tasks that need to be done; setToDo: a function that allows you to modify the task variable.
  const navigate = useNavigate();

  let token = localStorage.getItem("token");
  let email = localStorage.getItem("username");

  async function getTasks() {
    let apiCall = `http://localhost:4000/todo/${email}`;
    const response = await fetch(apiCall, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Authorization: `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer"
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((response) => {
        let getTodo = []; //how do i optimize this
        response.forEach((data) => {
          getTodo.push({ name: data.todo, finished: false, uid: data.uid });
        });
        setTasks(getTodo);
      })
      .catch((e) => {
        console.log("error", e);
      });
  }

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    // Update the document title using the browser API
    getTasks();
  }, []);

  const [taskName, setTaskName] = useState("");

  async function addTask() {
    let apiCall = "http://localhost:4000/todo/";

    if (taskName === "") {return;}
    var nameArray = tasks.map((todo) => { return todo.name; });
    if (nameArray.includes(taskName)) {return;}
        await fetch(apiCall, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ email: {email}, todo: taskName })
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error();
          }
          tasks.includes(taskName)
            ? alert("Task already exists")
            : setTasks(tasks.concat({ name: taskName, completed: false }));
          setTaskName("");
          return response.json();
        })
        .catch((e) => {
          console.log(e);
        });
    }    
    async function deleteTask(task) {
    let apiCall = "http://localhost:4000/todo/";
    const response = await fetch(apiCall, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ uid: task.uid })
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        } else {
          const newTasks = tasks.filter((obj) => obj.name !== task.name);
          console.log(newTasks);
          setTasks(newTasks);
        }
        console.log(tasks);
        return response.json();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function deleteTask(task) {
    let apiCall = "http://localhost:4000/todo/";
    const response = await fetch(apiCall, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ uid: task.uid })
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error();
        } else {
          const newTasks = tasks.filter((obj) => obj.name !== task.name);
          console.log(newTasks);
          setTasks(newTasks);
        }
        console.log(tasks);
        return response.json();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function addTask() {
    // makes sure that taskName is not blank
    if (taskName) {
      // makes sure that taskName is a new task
      tasks.includes(taskName)
        ? alert("Task already exists")
        : setTasks(tasks.concat({ name: taskName, completed: false }));
      setTaskName("");
    }
  }

  function updateTask(name) {
    setTasks(
      tasks.map((task) => {
        if (task.name === name) {
          task.finished = !task.finished;
          deleteTask(task);
        }
        return task;
      })
    );
  }

  function getSummary() {
    let unfinishedTasks = 0;
    tasks.forEach((task) => {
      if (task.finished === false) {
        unfinishedTasks += 1;
      }
    });
    if (unfinishedTasks === 1) {
      return <Title order={2}>You have 1 unfinished task</Title>;
    } else if (unfinishedTasks >= 1) {
      return (
        <Title order={2}>You have {unfinishedTasks} tasks left to do</Title>
      );
    }
  }

  return (
    <Stack align="center" justify="center" p="xl">
      {getSummary()}
      <Group>
        <Input
          value={taskName}
          placeholder="Type your task here"
          onChange={(event) => setTaskName(event.target.value)}
        ></Input>
        <Button rightIcon={<FaPlus />} onClick={() => addTask()}>
          Add
        </Button>
      </Group>
      <Stack>
        {tasks.map((task, index) => (
          <Checkbox
            checked={task.finished}
            key={task.name}
            index={index}
            label={task.name}
            onChange={() => updateTask(task.name)}
          ></Checkbox>
        ))}
      </Stack>
    </Stack>
  );
}