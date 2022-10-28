
//* https://capsules7.herokuapp.com/api/user/:id

//* https://capsules7.herokuapp.com/api/group/:number

const table = document.querySelector('#container');

let lightORdark = true; //* true - light class, false - dark class

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
  IDlabel.textContent = 'test'
  row.appendChild(IDlabel);

  for(let i = 0; i < 7; i++) {
    const span = document.createElement('span');
    span.classList.add('font');
    span.textContent = 'test';
    row.appendChild(span);
  }

  const div = document.createElement('div');
  div.classList.add('btns');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('light-button');
  div.appendChild(editBtn);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('dark-button');
  div.appendChild(deleteBtn);

  row.appendChild(div);
}

const displayData = async () => {
  // const data = await getData();

  const row = createRow();

  // appendData(data, row);
  appendData(row);
}

displayData();