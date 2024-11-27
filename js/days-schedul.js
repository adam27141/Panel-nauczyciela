class ClassRoom {
  constructor() {
    const savedClasses = localStorage.getItem("classes");
    this.Classes = savedClasses ? JSON.parse(savedClasses) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem("classes", JSON.stringify(this.Classes));
  }
}

class View {
  constructor() {
    this.selectClass = document.querySelector(".select-class-schedule");
    this.scheduleCell = document.querySelectorAll(".clickable");
    this.modalSchedule = document.querySelector(".modal-schedule");
    this.scheduleAgree = document.querySelector(".schedule-agree");
    this.scheduleCancel = document.querySelector(".schedule-cancel");
    this.scheduleClear = document.querySelector(".schedule-clear");
    this.toastBox = document.querySelector(".toast-box"); // Assuming there's a container for toasts
    this.addEventListenersToCells();
    this.loadScheduleFromLocalStorage(); // Load schedule data on page load
    this.scheduleCancel.addEventListener("click", () => {
      this.modalSchedule.style.display = "none";
    });
  }

  addEventListenersToCells() {
    this.scheduleCell.forEach((cell) => {
      cell.addEventListener("click", () => {
        this.currentCell = cell;
        this.modalSchedule.style.display = "block";
      });
    });

    this.scheduleAgree.addEventListener("click", () => {
      if (this.selectClass.value === "notChosen") {
        this.showToast("Wybierz klase");
      } else if (this.currentCell) {
        this.currentCell.innerHTML = this.selectClass.value;
        this.modalSchedule.style.display = "none";
        this.saveScheduleToLocalStorage();
        this.currentCell = null;
      }
    });

    this.scheduleClear.addEventListener("click", () => {
      if (this.currentCell) {
        this.currentCell.innerHTML = "";
        this.modalSchedule.style.display = "none";
        this.saveScheduleToLocalStorage();
        this.currentCell = null;
      }
    });
  }

  renderClasses(classesArray) {
    this.selectClass.innerHTML = "";
    let defaultOption = document.createElement("option");
    defaultOption.value = "notChosen";
    defaultOption.textContent = "Wybierz klase";
    this.selectClass.appendChild(defaultOption);

    classesArray.forEach((classData) => {
      let optionElement = document.createElement("option");
      optionElement.value = classData.name;
      optionElement.textContent = classData.name;
      this.selectClass.appendChild(optionElement);
    });
  }

  showToast(message) {
    let toast = document.createElement("div");
    toast.classList.add("toast");
    let icon = `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="32px"
    height="32px"
    class="toast-icon"
    viewBox="0 0 56 56"
  >
    <path
      fill="orange"
      d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m-.023-20.39c-1.243 0-1.922-.727-1.97-1.97L25.68 17.97c-.047-1.29.937-2.203 2.273-2.203c1.313 0 2.32.937 2.274 2.226l-.329 11.555c-.047 1.265-.75 1.969-1.921 1.969m0 8.625c-1.36 0-2.626-1.078-2.626-2.532s1.243-2.53 2.626-2.53c1.359 0 2.624 1.054 2.624 2.53c0 1.477-1.289 2.532-2.624 2.532"
    />
  </svg>`;

    toast.innerHTML = `${icon}${message}`;
    this.toastBox.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 6000);
  }

  loadScheduleFromLocalStorage() {
    const savedSchedule = localStorage.getItem("schedule");
    if (savedSchedule) {
      const scheduleData = JSON.parse(savedSchedule);
      this.scheduleCell.forEach((cell, index) => {
        if (scheduleData[index]) {
          cell.innerHTML = scheduleData[index]; // Load the saved class into the cell
        }
      });
    }
  }

  saveScheduleToLocalStorage() {
    const scheduleData = [];
    this.scheduleCell.forEach((cell) => {
      scheduleData.push(cell.innerHTML); // Save the content of all cells
    });
    localStorage.setItem("schedule", JSON.stringify(scheduleData));
  }
}

class Controller {
  constructor(classes, View) {
    this.ClassRoom = classes;
    this.View = View;
  }

  main() {
    this.View.renderClasses(this.ClassRoom.Classes);
  }
}

let classes = new ClassRoom();
let view = new View();
let controller = new Controller(classes, view);
controller.main();
