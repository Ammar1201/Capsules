
//* https://capsules7.herokuapp.com/api/user/:id

//* https://capsules7.herokuapp.com/api/group/:number

const table = document.querySelector('#container');
const header = document.querySelector('#header');

let lightORdark = true; //* true - light class, false - dark class

const data = [];

const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    const data = res.json();
    return data;
  }
  catch (err) {
    console.log(err);
  }
}

const getData = async () => {
  const group1 = fetchData('https://capsules7.herokuapp.com/api/group/one');
  const group2 = fetchData('https://capsules7.herokuapp.com/api/group/two');

  const groupsData = await Promise.all([group1, group2]);

  const students = [];

  for(let group of groupsData) {
    for(let student of group) {
      students.push(fetchData('https://capsules7.herokuapp.com/api/user/' + student.id));
    }
  }
  return await Promise.all(students);
}

const createBtns = (cont) => {
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('light-button');
  cont.appendChild(editBtn);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('dark-button');
  cont.appendChild(deleteBtn);
}

const createSpans = (row) => {
  for(let i = 0; i < 7; i++) {
    const span = document.createElement('span');
    span.classList.add('font');
    row.appendChild(span);
  }
}

const createRow = () => {
  const row = document.createElement('div');

  if(lightORdark) {
    row.classList.add('light-row');
    lightORdark = !lightORdark;
  }
  else {
    row.classList.add('dark-row');
    lightORdark = !lightORdark;
  }

  table.appendChild(row);
  
  const IDlabel = document.createElement('label');
  IDlabel.classList.add('font');
  row.appendChild(IDlabel);

  createSpans(row);

  const div = document.createElement('div');
  div.classList.add('btns');

  createBtns(div);

  row.appendChild(div);
  return row;
}

const selectSpans = (row) => {
  const spans = [];
  let child = row.firstElementChild;
  while(child !== null) {
    if(child.tagName === 'SPAN') {
      spans.push(child);
    }
    child = child.nextElementSibling;
  }
  return spans;
}

const objToArr = (obj) => {
  const {gender, firstName, lastName, hobby, age, city, capsule} = obj;

  return [firstName, lastName, capsule, age, city, gender, hobby];
};

const appendData = (student, row) => {
  const spans = selectSpans(row);
  let i = 0;
  row.firstChild.textContent = parseInt(student.id);

  const studentArr = objToArr(student);
  data.push([parseInt(student.id), ...studentArr]);

  for(let key of studentArr) {
    spans[i].textContent = key;
    i += 1;
  }
}

const displayData = async () => {
  const students = await getData();
  // const student = {id:"005", gender:"male", firstName:"עמאר", lastName:"אלעמור", hobby:"משחקי מחשב", age:21, city:"כסיפה", capsule:2};

  for(let student of students) {
    const row = createRow();
    appendData(student, row);
  }
}

window.addEventListener('load', () => {
  displayData();
});

// header.addEventListener('click', (event) => {
//   const target = event.target;
//   console.log(target);
// },
// {
//   capture : true
// }
// );

