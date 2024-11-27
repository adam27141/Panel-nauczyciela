class ClassRoom {
  constructor() {
    const savedClasses = localStorage.getItem("classes");
    this.Classes = savedClasses ? JSON.parse(savedClasses) : [];
  }

  saveToLocalStorage() {
    localStorage.setItem("classes", JSON.stringify(this.Classes));
  }

  addGradeToStudent(studentNumber, grade, classname) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            student.grades.push(grade);

            this.saveToLocalStorage();
            // console.log(this.Classes);
          }
        });
      }
    });
  }

  removeGradeFromStudent(studentNumber, index, classname) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            student.grades.splice(index, 1);

            this.saveToLocalStorage();
            // console.log(this.Classes);
          }
        });
      }
    });
  }

  calculateArithmeticMean(studentNumber, classname) {
    let result = 0; // Zmienna sumująca oceny
    let calculatedResult = 0; // Zmienna na średnią

    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            if (student.grades.length === 0) {
              calculatedResult = 0; // Brak ocen, średnia wynosi 0
              return;
            }

            // Przeliczanie ocen
            student.grades.forEach((grade) => {
              if (grade === "1+") {
                result = result + 1.5;
              } else if (grade === "1") {
                result = result + 1;
              } else if (grade === "1-") {
                result = result + 0.5;
              } else if (grade === "2+") {
                result = result + 2.5;
              } else if (grade === "2") {
                result = result + 2;
              } else if (grade === "2-") {
                result = result + 1.5;
              } else if (grade === "3+") {
                result = result + 3.5;
              } else if (grade === "3") {
                result = result + 3;
              } else if (grade === "3-") {
                result = result + 2.5;
              } else if (grade === "4+") {
                result = result + 4.5;
              } else if (grade === "4") {
                result = result + 4;
              } else if (grade === "4-") {
                result = result + 3.5;
              } else if (grade === "5+") {
                result = result + 5.5;
              } else if (grade === "5") {
                result = result + 5;
              } else if (grade === "5-") {
                result = result + 4.5;
              } else if (grade === "6") {
                result = result + 6; //
              } else if (grade === "6-") {
                result = result + 5.5;
              }
            });

            // Obliczanie średniej
            calculatedResult = result / student.grades.length;
          }
        });
      }
    });

    // Zaokrąglanie wyniku do dwóch miejsc po przecinku
    return calculatedResult.toFixed(2);
  }

  editGradeForStudent(studentNumber, index, newGrade, classname) {
    this.Classes.forEach((classData) => {
      if (classname === classData.name) {
        classData.students.forEach((student) => {
          if (student.number === studentNumber) {
            // Aktualizacja oceny na podanej pozycji
            if (index >= 0 && index < student.grades.length) {
              student.grades[index] = newGrade;
              console.log(this.Classes);
              this.saveToLocalStorage(); // Zapisz zmiany w lokalnym magazynie
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
    this.gradeModal = document.querySelector(".modal-add-grade");
    this.cencelAddGradeBtn = document.querySelector(".cencel-grade-btn");
    this.addGradeBtn = document.querySelector(".add-btn-grade");
    this.gradeInput = document.querySelector(".grade-input");

    this.removeOrEditGradeModal = document.querySelector(
      ".modal-remove-edit-grade"
    );

    this.cencelRemoveOrEditBtn = document.querySelector(".cencel-grade-btn");
    this.removeGradeButton = document.querySelector(".remove-grade-btn");

    this.editModal = document.querySelector(".modal-edit-grade");
    this.editButton = document.querySelector(".edit-grade-btn");
    this.cencelEdit = document.querySelector(".cencel-edit-btn");
    this.cencelEditAndRemoveBtn = document.querySelector(
      ".cencel-edit-remove-btn"
    );
    this.agreeEditButton = document.querySelector(".agree-edit-btn");
    this.gradeInputEdit = document.querySelector(".grade-edit-input");
    //Student List
    this.studentListDiv = document.querySelector(".students-list");

    this.toastBox = document.querySelector(".toast-box");

    this.addEventListeners();
    this.listenIfSelectedClassChange();
    this.renderClasses(classes.Classes);
  }

  addEventListeners() {
    this.cencelAddGradeBtn.addEventListener("click", () => {
      this.gradeModal.style.display = "none";
    });

    this.cencelRemoveOrEditBtn.addEventListener("click", () => {
      this.removeOrEditGradeModal.style.display = "none";
    });

    this.editButton.addEventListener("click", () => {
      this.removeOrEditGradeModal.style.display = "none";
      this.editModal.style.display = "block";
    });

    this.cencelEditAndRemoveBtn.addEventListener("click", () => {
      this.removeOrEditGradeModal.style.display = "none";
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
            let addGradeButton = document.createElement("button");
            let gradesContainer = document.createElement("div");
            let arithmeticMean = document.createElement("p");
            gradesContainer.setAttribute("class", "grades-container");
            studentPElement.setAttribute("class", "student");
            addGradeButton.setAttribute("class", "addGradeButton");
            arithmeticMean.setAttribute("class", "arithmetic-mean");
            addGradeButton.innerHTML = "+";
            studentPElement.textContent = `${student.number} - ${student.name} ${student.surname}`;
            studentListDiv.appendChild(studentPElement);
            studentPElement.appendChild(addGradeButton);
            studentPElement.appendChild(gradesContainer);
            studentPElement.appendChild(arithmeticMean);
            arithmeticMean.innerHTML = classes.calculateArithmeticMean(
              student.number,
              classnameSelected
            );
            addGradeButton.addEventListener("click", () => {
              this.gradeModal.style.display = "block";

              this.addGradeBtn.onclick = () => {
                if (
                  this.gradeInput.value === "NotChosen" ||
                  this.gradeInput.value === ""
                ) {
                  this.showToast("Nie wybrano oceny");
                } else {
                  classes.addGradeToStudent(
                    student.number,
                    this.gradeInput.value,
                    classnameSelected
                  );
                  arithmeticMean.innerHTML = classes.calculateArithmeticMean(
                    student.number,
                    classnameSelected
                  );
                }

                this.renderGrades(gradesContainer, student.grades);

                this.gradeModal.style.display = "none";

                this.gradeInput.value = "";
              };
            });

            this.renderGrades(gradesContainer, student.grades);

            //USUWANIE OCEN
            gradesContainer.addEventListener("click", (event) => {
              // Sprawdzamy, czy kliknięty element to ocena
              if (event.target && event.target.matches(".grade-element")) {
                // Pobierz indeks klikniętej oceny
                const index = parseInt(
                  event.target.getAttribute("data-index"),
                  10
                );

                // Sprawdź, czy ocena istnieje w tablicy student.grades
                if (index >= 0 && index < student.grades.length) {
                  // Otwórz modal
                  this.removeOrEditGradeModal.style.display = "block";

                  // Usuń istniejące nasłuchiwacze, aby uniknąć nakładania
                  this.removeGradeButton.onclick = null;
                  this.agreeEditButton.onclick = null;

                  // Dodaj nowy nasłuchiwacz do przycisku usuwania
                  this.removeGradeButton.onclick = () => {
                    classes.removeGradeFromStudent(
                      student.number,
                      index,
                      classnameSelected
                    );
                    this.removeOrEditGradeModal.style.display = "none";
                    arithmeticMean.innerHTML = classes.calculateArithmeticMean(
                      student.number,
                      classnameSelected
                    );
                    this.renderGrades(gradesContainer, student.grades);
                  };

                  // Dodaj nowy nasłuchiwacz do przycisku edytowania
                  this.agreeEditButton.onclick = () => {
                    const newGrade = this.gradeInputEdit.value;
                    if (newGrade === "NotChosen" || newGrade === "") {
                      this.showToast("Nie wybrano oceny");
                    } else {
                      classes.editGradeForStudent(
                        student.number,
                        index,
                        newGrade,
                        classnameSelected
                      );
                      arithmeticMean.innerHTML =
                        classes.calculateArithmeticMean(
                          student.number,
                          classnameSelected
                        );
                      this.editModal.style.display = "none";
                      this.renderGrades(gradesContainer, student.grades);
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

  renderGrades(divElement, gradesArray) {
    divElement.innerHTML = "";

    // Filtruj oceny dla wybranego ucznia
    gradesArray.forEach((grade, index) => {
      let gradeElement = document.createElement("div");
      gradeElement.setAttribute("class", "grade-element");
      gradeElement.setAttribute("data-index", index);
      gradeElement.innerHTML = grade;
      divElement.appendChild(gradeElement);

      if (gradeElement.innerHTML === "1" || gradeElement.innerHTML === "1+") {
        gradeElement.style.backgroundColor = "#ff595e";
      } else if (
        gradeElement.innerHTML === "2" ||
        gradeElement.innerHTML === "2-" ||
        gradeElement.innerHTML === "2+"
      ) {
        gradeElement.style.backgroundColor = "#ff924c";
      } else if (
        gradeElement.innerHTML === "3" ||
        gradeElement.innerHTML === "3-" ||
        gradeElement.innerHTML === "3+"
      ) {
        gradeElement.style.backgroundColor = "#ffca3a";
      } else if (
        gradeElement.innerHTML === "4" ||
        gradeElement.innerHTML === "4-" ||
        gradeElement.innerHTML === "4+"
      ) {
        gradeElement.style.backgroundColor = "#8ac926";
      } else if (
        gradeElement.innerHTML === "5" ||
        gradeElement.innerHTML === "5-" ||
        gradeElement.innerHTML === "5+"
      ) {
        gradeElement.style.backgroundColor = "#1982c4";
      } else if (
        gradeElement.innerHTML === "6" ||
        gradeElement.innerHTML === "6-" ||
        gradeElement.innerHTML === "6+"
      ) {
        gradeElement.style.backgroundColor = "#6a4c93";
      }

      // gradeElement.addEventListener("click", () => {
      //   classes.removeGradeFromStudent(1, index);
      //   console.log(index);
      // });
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
