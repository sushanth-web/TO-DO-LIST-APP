let light = document.getElementById("light")
let dark = document.getElementById("dark")
let teal = document.getElementById("teal")
let body = document.querySelector("body")
let igot = document.querySelector(".igot")
let input = document.querySelector(".text")
let ul = document.querySelector(".ul-el")

// Set the dark mode theme
const setDarkMode = () => {
    body.className = "dark"
    dark.checked = true
}

// Set the light mode theme
const setLightMode = () => {
    body.className = "light"
    light.checked = true
}

// Set the teal mode theme
const tealMode = () => {
    body.className = "teal"
    teal.checked = true
}

// Load the saved color mode or default to system preference
const setColorMode = () => {
    const savedMode = localStorage.getItem('colorMode')
    if (savedMode === "dark") {
        return setDarkMode()
    } else if (savedMode === "light") {
        return setLightMode()
    } else if (savedMode === "teal") {
        return tealMode()
    } else {
        if (window.matchMedia('(prefers-color-scheme:light)').matches) {
            return setLightMode()
        } else {
            return setDarkMode()
        }
    }
}

setColorMode()

light.addEventListener("click", function () {
    localStorage.setItem('colorMode', 'light')
    setLightMode()
})

dark.addEventListener("click", function () {
    localStorage.setItem('colorMode', 'dark')
    setDarkMode()
})

teal.addEventListener("click", function () {
    localStorage.setItem('colorMode', 'teal')
    tealMode()
})

// Create task item with support for checked state
function createTaskItem(taskObj) {
    let li = document.createElement("li")
    li.className = "task"

    if (taskObj.completed) {
        li.classList.add("strike")
    }

    let taskText = document.createElement("span")
    taskText.className = "task-text"
    taskText.textContent = taskObj.text
    li.appendChild(taskText)

    let div = document.createElement("div")
    div.className = "buttons"

    let radio1 = document.createElement("input")
    radio1.type = "radio"
    radio1.className = "tick"
    radio1.name = "tick-" + Date.now()
    radio1.checked = taskObj.completed

    let radio2 = document.createElement("input")
    radio2.type = "radio"
    radio2.className = "delete"

    let span1 = document.createElement("span")
    span1.className = "right"
    span1.innerHTML = "&#10004;"

    let span2 = document.createElement("span")
    span2.className = "left"
    span2.innerHTML = "&#x1F5D1;"

    div.appendChild(radio1)
    div.appendChild(radio2)
    div.appendChild(span1)
    div.appendChild(span2)
    li.appendChild(div)
    ul.appendChild(li)

    radio1.addEventListener("click", function () {
        li.classList.toggle("strike")
        taskObj.completed = !taskObj.completed
        updateTaskInStorage(taskObj)
    })

    radio2.addEventListener("click", function () {
        ul.removeChild(li)
        removeTaskFromStorage(taskObj.text)
    })
}

// Load tasks from localStorage and render them
function loadTasks() {
    let saved = JSON.parse(localStorage.getItem("tasks")) || []
    saved.forEach(task => {
        createTaskItem(task)
    })
}

// Save a new task
function saveTask(text) {
    let saved = JSON.parse(localStorage.getItem("tasks")) || []
    let newTask = { text: text, completed: false }
    saved.push(newTask)
    localStorage.setItem("tasks", JSON.stringify(saved))
}

// Update the completion status of a task
function updateTaskInStorage(textObj) {
    let saved = JSON.parse(localStorage.getItem("tasks")) || []
    saved = saved.map(task => {
        if (task.text === textObj.text) {
            return textObj
        }
        return task
    })
    localStorage.setItem("tasks", JSON.stringify(saved))
}

// Remove task by text
function removeTaskFromStorage(text) {
    let saved = JSON.parse(localStorage.getItem("tasks")) || []
    saved = saved.filter(task => task.text !== text)
    localStorage.setItem("tasks", JSON.stringify(saved))
}

// Handle adding a new task
igot.addEventListener("click", function () {
    let value = input.value.trim()
    if (value !== "") {
        let taskObj = { text: value, completed: false }
        createTaskItem(taskObj)
        saveTask(value)
        input.value = ""
    }
})

// Load tasks on startup
loadTasks()

// Update and display date/time every second
function updateDateTime() {
    const now = new Date()
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString()
    document.getElementById("datetime").textContent = `${date} ${time}`
}

updateDateTime()
setInterval(updateDateTime, 1000)
