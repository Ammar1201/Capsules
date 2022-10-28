
//* https://capsules7.herokuapp.com/api/user/:id

//* https://capsules7.herokuapp.com/api/group/:number

const table = document.querySelector('#container');
const header = document.querySelector('#header');

let lightORdark = true; //* true - light class, false - dark class

const info = [];

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
  // data.push([parseInt(student.id), ...studentArr]);

  for(let key of studentArr) {
    spans[i].textContent = key;
    i += 1;
  }
}

const displayData = async () => {
  const students = await getData();

  for(let student of students) {
    const row = createRow();
    appendData(student, row);
  }
}

const checkTarget = target => {
  return target.id !== 'confirm-edit' && target.id !== 'cancel-edit' && target.id !== 'confirm-delete' && target.id !== 'cancel-delete';
};

const handleEdit = tar => {
  const target = tar.parentElement.parentElement;
  const spans = selectSpans(target);

  spans.forEach(span => {
    span.setAttribute('contentEditable', 'true');
    info.push(span.textContent);
  });
};

const handleDelete = tar => {
  const target = tar.parentElement.parentElement;
  target.remove();
};

const confirmOrCancel = (target, status) => {
  target.classList.add('hide');
  target.nextElementSibling.classList.add('hide');

  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  cancel.classList.add('dark-button');
  cancel.id = 'cancel-' + status;

  const confirm = document.createElement('button');
  confirm.textContent = 'Confirm';
  confirm.classList.add('light-button');
  confirm.id = 'confirm-' + status;

  target.parentElement.appendChild(cancel);
  target.parentElement.appendChild(confirm);
};

const confirmEdit = target => {
  const spans = selectSpans(target.parentElement.parentElement);
  spans.forEach(span => {
    span.removeAttribute('contentEditable');
  });
  cancel(target.previousElementSibling);
};

const confirmOrCancelEdit = (target, status) => {
  if(status === 'confirm') {
    confirmEdit(target);
    return;
  }

  const spans = selectSpans(target.parentElement.parentElement);
  let i = 0;
  spans.forEach(span => {
    span.textContent = info[i];
    i += 1;
  });
  confirmEdit(target.nextElementSibling);
};

const cancel = target => {
  target.previousElementSibling.classList.remove('hide');
  target.previousElementSibling.previousElementSibling.classList.remove('hide');
  target.nextElementSibling.remove();
  target.remove();
};

window.addEventListener('load', () => {
  displayData();
});

table.addEventListener('click', (event) => {
  const target = event.target;

  console.dir(target);

  if(target.classList != '') {
    if(target.classList.contains('light-button') && checkTarget(target)) {
      handleEdit(target);
      confirmOrCancel(target, 'edit');
    }
    else if(target.classList.contains('dark-button') && checkTarget(target)) {
      confirmOrCancel(target.previousElementSibling, 'delete');
    }
    else if(target.id == 'confirm-edit') {
      confirmOrCancelEdit(target, 'confirm');
    }
    else if(target.id == 'cancel-edit') {
      confirmOrCancelEdit(target, 'cancel');
    }
    else if(target.id == 'confirm-delete') {
      handleDelete(target);
    }
    else if(target.id == 'cancel-delete') {
      cancel(target);
    }
    //confirmOrCancelDelete(target);
  }
},
{
  capture : true
}
);

// header.addEventListener('click', (event) => {
//   const target = event.target;
//   console.log(target);
// },
// {
//   capture : true
// }
// );

