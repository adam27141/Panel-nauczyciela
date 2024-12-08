class ClassRoom {
  constructor() {
    const savedClasses = localStorage.getItem("classes");
    this.Classes = savedClasses ? JSON.parse(savedClasses) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem("classes", JSON.stringify(this.Classes));
  }

  addAttendanceToStudent(
    studentNumber,
    classname,
    attendancePresence,
    attendanceHour
  ) {
    // Generujemy dzisiejszą datę w formacie DD.MM.YYYY
    const attendanceDate = new Date().toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            student.attendance.push({
              date: attendanceDate,
              attendancePresence: attendancePresence.value,
              attendanceHour: attendanceHour.value,
            });

            this.saveToLocalStorage();
            console.log(this.Classes);
          }
        });
      }
    });
  }

  removeAttendanceFromStudent(studentNumber, index, classname) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            student.attendance.splice(index, 1);

            this.saveToLocalStorage();
            // console.log(this.Classes);
          }
        });
      }
    });
  }

  editAttendanceForStudent(
    studentNumber,
    index,
    newAttendancePresence,
    newAttendanceHour,
    classname
  ) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            if (index >= 0 && index < student.attendance.length) {
              const existingAttendance = student.attendance[index];

              student.attendance[index] = {
                ...existingAttendance,
                attendancePresence: newAttendancePresence.value,
                attendanceHour: newAttendanceHour.value,
              };

              console.log(this.Classes);
              this.saveToLocalStorage();
            }
          }
        });
      }
    });
  }
}

class View {
  constructor() {
    //Classess

    this.selectClass = document.querySelector(".select-class");
    this.classInput = document.querySelector(".class-input");
    this.attendanceModal = document.querySelector(".modal-add-attendance");
    this.cencelAddAttendanceBtn = document.querySelector(
      ".cencel-attendance-btn"
    );
    this.addAttendanceBtn = document.querySelector(".add-btn-attendance");
    this.attendanceInput = document.querySelector(".attendance-input");
    this.attendanceInputHour = document.querySelector(".attendance-input-hour");

    this.removeOrEditAttendanceModal = document.querySelector(
      ".modal-remove-edit-attendance"
    );

    this.cencelRemoveOrEditBtn = document.querySelector(
      ".cencel-attendance-btn"
    );
    this.removeAttendanceButton = document.querySelector(
      ".remove-attendance-btn"
    );

    this.editModal = document.querySelector(".modal-edit-attendance");
    this.editButton = document.querySelector(".edit-attendance-btn");
    this.cencelEdit = document.querySelector(".cencel-edit-btn");
    this.cencelEditAndRemoveBtn = document.querySelector(
      ".cencel-edit-remove-btn"
    );
    this.agreeEditButton = document.querySelector(".agree-edit-btn");
    this.attendanceInputEdit = document.querySelector(".attendance-input-edit");
    this.attendanceInputEditHour = document.querySelector(
      ".attendance-input-hour-edit"
    );
    //Student List
    this.studentListDiv = document.querySelector(".students-list");

    this.toastBox = document.querySelector(".toast-box");

    this.addEventListeners();
    this.listenIfSelectedClassChange();
    this.renderClasses(classes.Classes);
  }

  addEventListeners() {
    this.cencelAddAttendanceBtn.addEventListener("click", () => {
      this.attendanceModal.style.display = "none";
    });

    this.cencelRemoveOrEditBtn.addEventListener("click", () => {
      this.removeOrEditAttendanceModal.style.display = "none";
    });

    this.editButton.addEventListener("click", () => {
      this.removeOrEditAttendanceModal.style.display = "none";
      this.editModal.style.display = "block";
    });

    this.cencelEditAndRemoveBtn.addEventListener("click", () => {
      this.removeOrEditAttendanceModal.style.display = "none";
    });
  }

  renderClasses(classesArray) {
    // Resetuj listę przed dodaniem nowych opcji
    this.selectClass.innerHTML = ""; // Usuwa wszystkie istniejące opcje

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

  listenIfSelectedClassChange() {
    this.selectClass.addEventListener("change", () => {
      this.renderStudents(classes.Classes);
    });
  }

  renderStudents(classesArray) {
    let studentListDiv = this.studentListDiv;
    let classnameSelected = this.selectClass.value;
    studentListDiv.innerHTML = "";

    if (!classnameSelected || classnameSelected === "notChosen") {
      let pClassNotChosen = document.createElement("p");
      pClassNotChosen.innerHTML = "Nie wybrano klasy";
      studentListDiv.appendChild(pClassNotChosen);
      return;
    }

    let classFound = false;

    classesArray.forEach((oneClass) => {
      if (oneClass.name === classnameSelected) {
        classFound = true;
        if (oneClass.students.length === 0) {
          let pNoStudents = document.createElement("p");
          pNoStudents.innerHTML = "Brak uczniów w tej klasie.";
          studentListDiv.appendChild(pNoStudents);
        } else {
          oneClass.students.forEach((student) => {
            let studentPElement = document.createElement("p");
            let addAttendanceButton = document.createElement("button");
            let attendanceContainer = document.createElement("div");

            attendanceContainer.setAttribute("class", "attendance-container");
            studentPElement.setAttribute("class", "student");
            addAttendanceButton.setAttribute("class", "addAttendanceButton");

            addAttendanceButton.innerHTML = "+";
            studentPElement.textContent = `${student.number} - ${student.name} ${student.surname}`;
            studentListDiv.appendChild(studentPElement);
            studentPElement.appendChild(addAttendanceButton);
            studentPElement.appendChild(attendanceContainer);

            addAttendanceButton.addEventListener("click", () => {
              this.attendanceModal.style.display = "block";

              this.addAttendanceBtn.onclick = () => {
                if (
                  this.attendanceInput.value === "NotChosen" ||
                  this.attendanceInput.value === ""
                ) {
                  this.showToast("Nie wybrano obecności");
                } else if (
                  this.attendanceInputHour.value === "NotChosen" ||
                  this.attendanceInputHour.value === ""
                ) {
                  this.showToast("Nie wybrano godziny");
                } else {
                  classes.addAttendanceToStudent(
                    student.number,
                    classnameSelected,
                    this.attendanceInput,
                    this.attendanceInputHour
                  );
                }

                this.renderAttendance(attendanceContainer, student.attendance);

                if (
                  this.attendanceInput.value === "NotChosen" ||
                  this.attendanceInput.value === ""
                ) {
                } else if (
                  this.attendanceInputHour.value === "NotChosen" ||
                  this.attendanceInputHour.value === ""
                ) {
                } else {
                  this.attendanceModal.style.display = "none";

                  this.attendanceInput.value = "";
                }
              };
            });

            this.renderAttendance(attendanceContainer, student.attendance);

            attendanceContainer.addEventListener("click", (event) => {
              if (event.target && event.target.matches(".attendance-element")) {
                // Pobierz indeks klikniętej oceny
                const index = parseInt(
                  event.target.getAttribute("data-index"),
                  10
                );

                if (index >= 0 && index < student.attendance.length) {
                  // Otwórz modal
                  this.removeOrEditAttendanceModal.style.display = "block";

                  // Usuń istniejące nasłuchiwacze, aby uniknąć nakładania
                  this.removeAttendanceButton.onclick = null;
                  this.agreeEditButton.onclick = null;

                  // Dodaj nowy nasłuchiwacz do przycisku usuwania
                  this.removeAttendanceButton.onclick = () => {
                    classes.removeAttendanceFromStudent(
                      student.number,
                      index,
                      classnameSelected
                    );
                    this.removeOrEditAttendanceModal.style.display = "none";

                    this.renderAttendance(
                      attendanceContainer,
                      student.attendance
                    );
                  };

                  // Dodaj nowy nasłuchiwacz do przycisku edytowania
                  this.agreeEditButton.onclick = () => {
                    const newAttendance = this.attendanceInputEdit;
                    const newAttendanceHour = this.attendanceInputEditHour;
                    if (
                      newAttendance.value === "NotChosen" ||
                      newAttendance.value === ""
                    ) {
                      this.showToast("Nie wybrano obecności");
                    } else if (
                      newAttendanceHour.value === "NotChosen" ||
                      newAttendanceHour.value === ""
                    ) {
                      this.showToast("Nie wybrano godziny");
                    } else {
                      classes.editAttendanceForStudent(
                        student.number,
                        index,
                        newAttendance,
                        newAttendanceHour,
                        classnameSelected
                      );

                      this.editModal.style.display = "none";
                      this.renderAttendance(
                        attendanceContainer,
                        student.attendance
                      );
                    }
                  };
                }
              }
            });

            //USUWANIE OCEN
          });
        }
      }
    });

    if (!classFound) {
      let pClassNotFound = document.createElement("p");
      pClassNotFound.innerHTML = "Klasa nie została znaleziona.";
      studentListDiv.appendChild(pClassNotFound);
    }
  }

  renderAttendance(divElement, attendanceArray) {
    divElement.innerHTML = "";

    // Filtruj oceny dla wybranego ucznia
    attendanceArray.forEach((attendance, index) => {
      let attendanceElement = document.createElement("div");
      let attendancePresence = document.createElement("p");
      let attendanceHour = document.createElement("p");
      let attendanceDate = document.createElement("p");
      attendanceElement.setAttribute("class", "attendance-element");
      attendanceElement.setAttribute("data-index", index);

      attendancePresence.innerHTML = `Obesność: ${attendance.attendancePresence}`;
      attendanceHour.innerHTML = `Godzina zajęć: ${attendance.attendanceHour}`;
      attendanceDate.innerHTML = `Data: ${attendance.date}`;

      attendanceElement.appendChild(attendancePresence);
      attendanceElement.appendChild(attendanceHour);
      attendanceElement.appendChild(attendanceDate);
      divElement.appendChild(attendanceElement);

      if (attendance.attendancePresence === "nb") {
        attendanceElement.style.backgroundColor = "#ff595e";
      } else if (attendance.attendancePresence === "ob") {
        attendanceElement.style.backgroundColor = "#8ac926";
      } else if (attendance.attendancePresence === "s") {
        attendanceElement.style.backgroundColor = "#ffca3a";
      }
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
}

class Controller {
  constructor(classes, View) {
    this.ClassRoom = classes;
    this.View = View;
  }

  main() {
    this.View.renderStudents(this.ClassRoom.Classes);
  }
}

let classes = new ClassRoom();
let view = new View();
let controller = new Controller(classes, view);
controller.main();
