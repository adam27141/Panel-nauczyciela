class ClassRoom {
  constructor() {
    // localStorage.removeItem("classes");
    const savedClasses = localStorage.getItem("classes");
    this.Classes = savedClasses ? JSON.parse(savedClasses) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem("classes", JSON.stringify(this.Classes));
  }

  addClass(classname) {
    let classData = {
      name: classname,
      students: [],
    };

    this.Classes.push(classData); // Dodajemy poprawny obiekt
    this.saveToLocalStorage();
    console.log(this.Classes);
  }

  removeClass(classname) {
    for (let i = this.Classes.length - 1; i >= 0; i--) {
      if (classname === this.Classes[i].name) {
        this.Classes.splice(i, 1);
      }
    }
    this.saveToLocalStorage();
    console.log(this.Classes);
  }

  addStudent(classname, name, surname) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        let studentNumber = this.studentNumber(classData);
        let student = {
          number: studentNumber,
          name: name,
          surname: surname,
          grades: [],
          attendance: [],
        };
        classData.students.push(student);
        this.sortAlphabetically(classData);
        this.updateStudentNumbers(classData);
      }
    });
    this.saveToLocalStorage();
    console.log(this.Classes);
  }

  removeStudentFromClass(classname, number) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student, index) => {
          if (student.number === number) {
            classData.students.splice(index, 1);
            this.sortAlphabetically(classData);
            this.updateStudentNumbers(classData);
            this.saveToLocalStorage();
            console.log(this.Classes);
          }
        });
      }
    });
  }

  studentNumber(classData) {
    let studentNumber = classData.students.length + 1;
    return studentNumber;
  }

  updateStudentNumbers(classData) {
    classData.students.forEach((student, index) => {
      student.number = index + 1;
    });
  }

  sortAlphabetically(classData) {
    classData.students.sort(function (a, b) {
      if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
      if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
  }
}

class View {
  constructor() {
    //Classess
    this.addClassButton = document.querySelector(".add-class-btn");
    this.selectClass = document.querySelector(".select-class");
    this.removeClassButton = document.querySelector(".remove-class-btn");
    this.modalAddClasses = document.querySelector(".modal-add-classes");
    this.cencelClassBtn = document.querySelector(".cencel-class-btn");
    this.addBtnClass = document.querySelector(".add-btn-class");
    this.classInput = document.querySelector(".class-input");

    //Add Students
    this.addStudentBtn = document.querySelector(".add-student-btn");
    this.modalAddStudent = document.querySelector(".modal-add-students");
    this.agreeBtn = document.querySelector(".add-btn");
    this.cencelBtn = document.querySelector(".cencel-btn");
    this.nameInput = document.querySelector(".name-input");
    this.surnameInput = document.querySelector(".surname-input");
    this.addStudentsTxt = document.querySelector(".add-students-from-txt");
    this.inputFileElement = document.querySelector(".file-input");
    this.modalAddStudentTxt = document.querySelector(".modal-add-studentsTxt");
    this.addStudentsBtnFromTxt = document.querySelector(".add-btn-fromtxt");
    this.cencelStudentsBtnFromTxt = document.querySelector(
      ".cencel-remove-btn-fromtxt"
    );

    //Remove Students
    this.removeStudentBtn = document.querySelector(".remove-student-btn");
    this.modalRemoveStudent = document.querySelector(".modal-remove-students");
    this.cencelRemoveBtn = document.querySelector(".cencel-remove-btn");
    this.removeBtn = document.querySelector(".remove-btn");
    this.numberInput = document.querySelector(".number-input");

    this.toastBox = document.querySelector(".toast-box");
    //Student List
    this.studentListDiv = document.querySelector(".students-list");

    this.addEventListeners();
    this.listenIfSelectedClassChange();
    this.renderClasses(classes.Classes);
  }

  addEventListeners() {
    this.addClassButton.addEventListener("click", () => {
      this.modalAddClasses.style.display = "block";
    });

    this.cencelClassBtn.addEventListener("click", () => {
      this.modalAddClasses.style.display = "none";
    });

    this.addStudentBtn.addEventListener("click", () => {
      let selectedOption = this.selectClass.value;
      if (selectedOption === "notChosen") {
        this.showToast("Nie wybrano klasy");
      } else {
        this.modalAddStudent.style.display = "block";
      }
    });

    this.cencelBtn.addEventListener("click", () => {
      this.modalAddStudent.style.display = "none";
    });

    this.removeStudentBtn.addEventListener("click", () => {
      let selectedOption = this.selectClass.value;
      if (selectedOption === "notChosen") {
        this.showToast("Nie wybrano klasy");
      } else {
        this.modalRemoveStudent.style.display = "block";
      }
    });

    this.cencelRemoveBtn.addEventListener("click", () => {
      this.modalRemoveStudent.style.display = "none";
    });

    this.addStudentsTxt.addEventListener("click", () => {
      let selectedOption = this.selectClass.value;
      if (selectedOption === "notChosen") {
        this.showToast("Nie wybrano klasy");
      } else {
        this.modalAddStudentTxt.style.display = "block";
      }
    });

    this.addStudentsBtnFromTxt.addEventListener("click", () => {
      this.inputFileElement.click();
      this.modalAddStudentTxt.style.display = "none";
    });

    this.cencelStudentsBtnFromTxt.addEventListener("click", () => {
      this.modalAddStudentTxt.style.display = "none";
    });
  }

  addClass(addClassFunction) {
    this.addBtnClass.addEventListener("click", () => {
      let classname = this.classInput.value;

      if (classname) {
        let optionClassElement = document.createElement("option");
        optionClassElement.innerText = classname;
        optionClassElement.setAttribute("value", classname);
        this.selectClass.appendChild(optionClassElement);

        addClassFunction(classname);
        this.renderClasses(classes.Classes);
        this.classInput.value = "";
        this.modalAddClasses.style.display = "none";
      } else {
        this.showToast("Prosze wypelnic nazwe klasy.");
      }
    });
  }

  removeClass(removeClassFunction) {
    this.removeClassButton.addEventListener("click", () => {
      let selectedOption = this.selectClass.value;

      let options = this.selectClass.options;

      if (selectedOption === "notChosen") {
        this.showToast("Nie wybrano klasy");
      } else {
        for (let i = options.length - 1; i >= 0; i--) {
          if (selectedOption === options[i].value) {
            this.selectClass.remove(i);
          }
        }
        removeClassFunction(selectedOption);
        this.renderClasses(classes.Classes);
        this.renderStudents(classes.Classes);
      }
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
  addStudentToClass(addStudentFunction) {
    this.agreeBtn.addEventListener("click", () => {
      let name = this.nameInput.value;
      let surname = this.surnameInput.value;
      let classname = this.selectClass.value;

      if (name && surname) {
        const hasNumbers = /\d/;

        if (hasNumbers.test(name) || hasNumbers.test(surname)) {
          this.showToast("Imie i nazwisko nie moga zawierac cyfr.");
        } else {
          addStudentFunction(classname, name, surname);
          this.renderStudents(classes.Classes);
          this.nameInput.value = "";
          this.surnameInput.value = "";
          this.modalAddStudent.style.display = "none";
        }
      }
    });
  }

  removeStudent(removeStudentFunction) {
    this.removeBtn.addEventListener("click", () => {
      const number = this.numberInput.value;
      const selectedClass = this.selectClass.value;
      if (number) {
        removeStudentFunction(selectedClass, parseInt(number, 10));
        this.modalRemoveStudent.style.display = "none";
        this.numberInput.value = "";
        this.renderStudents(classes.Classes);
      } else {
        this.showToast("Prosze podac numer z dziennika.");
      }
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
            studentPElement.setAttribute("class", "student");
            studentPElement.textContent = `${student.number} - ${student.name} ${student.surname}`;
            studentListDiv.appendChild(studentPElement);
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

  addStudentsFromFile(addStudentFunction) {
    this.inputFileElement.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const lines = content.split("\n");

        lines.forEach((line) => {
          const [name, surname] = line.trim().split(" ");
          if (name && surname) {
            const classname = this.selectClass.value;
            addStudentFunction(classname, name.trim(), surname.trim());
          }
        });

        if (this.selectClass.value) {
          if (classes && Array.isArray(classes.Classes)) {
            this.renderStudents(classes.Classes);
          } else {
            console.error("Classes są niezdefiniowane lub nie są tablicą.");
          }
        } else {
          console.error("Nie wybrano klasy do renderowania uczniów.");
        }

        // Wyczyść pole input po przetworzeniu pliku
        this.inputFileElement.value = ""; // Resetowanie input
      };
      reader.readAsText(file);
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
    this.View.addClass((classname) => this.ClassRoom.addClass(classname));
    this.View.removeClass((classname) => this.ClassRoom.removeClass(classname));
    this.View.addStudentToClass((classname, name, surname) =>
      this.ClassRoom.addStudent(classname, name, surname)
    );

    this.View.removeStudent((classname, number) => {
      this.ClassRoom.removeStudentFromClass(classname, number);
    });

    this.View.addStudentsFromFile((classname, name, surname) =>
      this.ClassRoom.addStudent(classname, name, surname)
    );
    this.View.renderStudents(this.ClassRoom.Classes);
  }
}

let classes = new ClassRoom();
let view = new View();
let controller = new Controller(classes, view);
controller.main();

//do naprawienia usuwanie ucznia z klasy
