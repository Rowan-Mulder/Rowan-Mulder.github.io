"use-strict"
let consoleWindow = document.querySelector(".console")
let consoleBody = document.querySelector(".consoleBody")
let consoleLog = document.getElementById("consoleLog")
let consoleCursor = document.getElementById("consoleCursor")
let updateNotification = document.getElementById("updateNotification")
let smartsenseTasks = document.getElementById("smartsenseTasks")
let isConsoleOpen = false
let isConsoleProcessing = false
let isConsoleCursorBlinking = true
let consoleProcessingInterval
let consolePopupWindowsOpened = 0
let consolePopupWindows = [
    document.getElementById("consolePopup1"),
    document.getElementById("consolePopup2"),
    document.getElementById("consolePopup3"),
    document.getElementById("consolePopup4")
]
let randomConsoleLogArray = [
    [// Verbs
       "sorting", "counting", "testing", "calculating", "processing", "allocating", "configuring", "computing", "cracking", "pinging", "streaming", "downloading", "uploading", "clearing", "finding"
    ],
    [// Subjects
        "memory", "cloud storage", "code", "processes", "timings", "camera's", "devices", "electronics", "temperature information", "network", "logs", "security settings", "audio devices", "new detected hardware", "updates", "upgrades"
    ],
    [// End of line
        "<br>", "; ", " => ", ", "
    ],
]

function ConsoleOpenClose() {
    if (consoleWindow.classList.contains("d-none")) {
        consoleWindow.classList.remove("d-none")
        setTimeout(() => {
            if (!isConsoleProcessing) {
                consoleLog.innerHTML = "C:\\WINDOWS\\system32>"
            }
        }, 500)
    } else {
        consoleWindow.classList.add("d-none")
        if (!isConsoleProcessing) {
            consoleLog.innerHTML = ""
        }
    }
    isConsoleOpen = !isConsoleOpen
}

function ConsoleStartStop() {
    ConsoleProcessingStartStop()
    if (isConsoleProcessing) {
        consoleLog.innerHTML = "C:\\WINDOWS\\system32>"
    }
    ConsoleCursorBlinkingStartStop()
    isConsoleProcessing = !isConsoleProcessing
}

function ConsoleCursorBlinkingStartStop() {
    consoleCursor.style.display = (isConsoleCursorBlinking) ? "none" : "inline-block"
    isConsoleCursorBlinking = !isConsoleCursorBlinking
}

function ConsoleProcessingStartStop() {
    if (isConsoleProcessing) {
        clearInterval(consoleProcessingInterval)
    } else {
        consoleLog.innerHTML += "<br>"
        consoleProcessingInterval = setInterval(() => {
            consoleLog.innerHTML +=
                  (randomConsoleLogArray[0][Math.floor(Math.random() * randomConsoleLogArray[0].length)] + " ")
                + (randomConsoleLogArray[1][Math.floor(Math.random() * randomConsoleLogArray[1].length)])
                + (randomConsoleLogArray[2][Math.floor(Math.random() * randomConsoleLogArray[2].length)])
            switch (Math.round(Math.random() * 50)) {
                case 5:
                case 10:
                    consoleLog.innerHTML += ("<br>Warning: " + randomConsoleLogArray[0][Math.round(Math.random() * randomConsoleLogArray[0].length)] + " may be operating incorrectly<br>").fontcolor("orange")
                    break
                case 20:
                    consoleLog.innerHTML += ("<br>Error: process interrupted by faulty " + randomConsoleLogArray[1][Math.round(Math.random() * randomConsoleLogArray[1].length)] + "<br>").fontcolor("red")
                    break
            }
            consoleBody.scrollTop = consoleBody.scrollHeight
        }, 50)
    }
}

function consoleCloseBtnClick() {
    switch (consolePopupWindowsOpened) {
        case 0:
        case 1:
        case 2:
        case 3:
            consolePopupWindows[consolePopupWindowsOpened++].classList.remove("d-none")
            break
    }
}

function consoleWindowClose(consoleWindow) {
    if (consoleWindow.parentElement.parentElement !== consolePopupWindows[1] || consolePopupWindowsOpened < 4 || !isConsoleOpen || !isConsoleProcessing) {
        return
    }
    consoleWindow.parentElement.parentElement.classList.add("d-none")
    clearInterval(consoleProcessingInterval)
    isConsoleProcessing = false
    consoleLog.innerHTML += "<br><br>processes have been stopped and reversed<br><br><br><br><br>".fontcolor("green")
    consoleBody.scrollTop = consoleBody.scrollHeight
    setTimeout(() => {
        consoleLog.innerHTML += "<br><br>JUST KIDDING<br><br><br><br><br>".fontcolor("red")
        consoleBody.scrollTop = consoleBody.scrollHeight
    }, 4000)
    setTimeout(() => {
        consolePopupWindows.forEach((x) => {
            if (!x.classList.contains("d-none")) {
                x.classList.add("d-none")
            }
        })
        ConsoleProcessingStartStop()
    }, 6000)
}

document.querySelectorAll(".cameraName").forEach((x) => {
    x.addEventListener("mouseenter", () => {SwitchDesignMode("on")})
    x.addEventListener("mouseout", () => {SwitchDesignMode("off")})
})

function SwitchDesignMode(mode) {
    document.designMode = mode
}

function OpenUpdateNotification() {
    updateNotification.classList.remove("d-none")
}

function notificationWindowClose(notificationWindow) {
    notificationWindow.parentNode.parentNode.classList.add("d-none")
}

function UpdateProgram() {
    document.querySelector(".notificationPart1").classList.add("d-none")
    document.querySelector(".notificationPart2").classList.remove("d-none")
    setTimeout(() => {
        let updater = setInterval(() => {
            document.querySelector(".updateMeter").value += Math.round(Math.random() * 5)
            document.querySelector(".updateMeterText").innerHTML = document.querySelector(".updateMeter").value + "%";
        }, 30)
        setTimeout(() => {
            clearInterval(updater)
            document.querySelector(".updateMeter").value = 100
            document.querySelector(".updatingMessage").innerHTML = "Update complete!"
            document.querySelector(".updateMeterText").innerHTML = "100%";

            setTimeout(() => {
                document.querySelectorAll(".notification").forEach((x) => {
                    x.classList.add("d-none")
                })

                setTimeout(() => {
                    smartsenseTasksDisplay()
                }, 1000)
            }, 2000)
        }, 1000)
    }, 500)
}

function smartsenseTasksDisplay() {
    smartsenseTasks.classList.remove("d-none");
    let smartsenseTaskPosition = 0;
    let smartsenseTaskRevealer = setInterval(() => {
        let smartsenseTasklist = document.querySelector(".smartsenseTasklist").children
        smartsenseTasklist[smartsenseTaskPosition++].classList.remove("d-none");
        if (smartsenseTaskPosition === smartsenseTasklist.length) {
            clearInterval(smartsenseTaskRevealer);
        }
    }, 1500);
}