
//* https://capsules7.herokuapp.com/api/user/:id

//* https://capsules7.herokuapp.com/api/group/:number

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