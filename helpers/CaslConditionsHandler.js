conditions = {
  userId: "$$user.id$$",
  age: 100,
  title: "$$title$$",
  createdAt: { $lte: "$$today$$" },
  status: { $in: ["review", "$$article.ispublished$$"] },
  price: { $gte: 10, $lte: "$$lteNumber$$" },
};

realdata = {
  user: {
    id: 15,
    age: 100,
  },
  job: "webdeveloper",
  title: "joy boy is back lol xd",
  today: "21/01/2023",
  lteNumber: 3333,
  article: {
    ispublished: false,
  },
};

function removeDoubleDollars(inputString) {
  return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
}

function getDataByStringPath(path, dataObj) {
  const pathParts = path.split(".");
  let currentObj = dataObj;

  for (const part of pathParts) {
    if (currentObj && part in currentObj) {
      currentObj = currentObj[part];
    } else {
      return undefined; // Property not found, return undefined
    }
  }

  return currentObj;
}

function replacePlaceholders(conditions, realdata) {
  Editedconditions = { ...conditions };

  function replacer(obj, realdata) {
    for (key in obj) {
      if (typeof obj[key] === "string" && /^\$\$.*\$\$$/.test(obj[key])) {
        stringWithoutDollars = removeDoubleDollars(obj[key]);
        console.log(`${key}: ${obj[key]} and string without $$$$ : ${stringWithoutDollars}  and real data value is : ${getDataByStringPath(stringWithoutDollars, realdata)} `);
        obj[key] = getDataByStringPath(stringWithoutDollars, realdata);
      } else if (typeof obj[key] === "object") {
        replacer(obj[key], realdata);
      }
    }
  }

  replacer(Editedconditions, realdata);
  return Editedconditions;
}

module.exports = replacePlaceholders;

// )))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

// // method 2 using JSON.parse
// realdata = {
// user : {
// id : 4
// }
// }
// str = '{"userId": "user.id"}';
//  parsedStr = str.replace(/(\w+)\.(\w+)/g, (match, p1, p2) => realdata[p1][p2]);

//  obj = JSON.parse(parsedStr);
// console.log(obj); // Output: { userId: 26 }

// // method 3 using eval
// user = {
// id : 10
// }

//  str = `{userId: "user.id" , age : 100 }`;

//  obj = eval("(" + str + ")");
// console.log(obj); // Output: { userId: 26 }

// // ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

// conditions = {
//   userId: "$$user.id$$",
//   age: 100,
//   title: "$$title$$",
//   createdAt: { $lte: "$$today$$" },
//   status: { $in: ["review", "$$article.ispublished$$"] },
//   price: { $gte: 10, $lte: "$$lteNumber$$" },
// };

// realdata = {
//   user: {
//     id: 15,
//     age: 100,
//   },
//   job: "webdeveloper",
//   title: "joy boy is back lol xd",
//   today: "21/01/2023",
//   lteNumber: 3333,
//   article: {
//     ispublished: false,
//   },
// };

// function removeDoubleDollars(inputString) {
//   return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
// }

// function getDataByStringPath(path, dataObj) {
//   const pathParts = path.split(".");
//   let currentObj = dataObj;

//   for (const part of pathParts) {
//     if (currentObj && part in currentObj) {
//       currentObj = currentObj[part];
//     } else {
//       return undefined; // Property not found, return undefined
//     }
//   }

//   return currentObj;
// }

// // function replacePlaceholders(conditions, realdata) {

// // }

// function replacePlaceholders(obj, realdata) {
//   for (key in obj) {
//     if (typeof obj[key] === "string" && /^\$\$.*\$\$$/.test(obj[key])) {
//       stringWithoutDollars = removeDoubleDollars(obj[key]);
//       console.log(`${key}: ${obj[key]} and string without $$$$ : ${stringWithoutDollars}  and real data value is : ${getDataByStringPath(stringWithoutDollars, realdata)} `);
//       obj[key] = getDataByStringPath(stringWithoutDollars, realdata);
//     } else if (typeof obj[key] === "object") {
//       replacePlaceholders(obj[key], realdata);
//     }
//   }
// }

// replacePlaceholders(conditions, realdata);
// console.log(conditions);

// // )))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

// conditions = {
//     userId: "$$user.id$$", age: 100, title: "$$title$$", createdAt: { $lte: "$$today$$" },
//     status: { $in: ["review", "$$article.ispublished$$"] }, price: { $gte: 10, $lte: "$$lteNumber$$" }
// };

// realdata = {
//     "user": {
//         id: 15,
//         "age": 100,
//     },
//     "job": "webdeveloper", "title": "joy boy is back lol xd"
//     , "today": "21/01/2023", "lteNumber": 3333,
//     "article": {
//         "ispublished": false
//     }
// }
// //Editedconditions = { ...conditions };

// function removeDoubleDollars(inputString) {
//     return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
// }

// function replacePlaceholders(obj, realdata) {
//     for (key in obj) {
//         if (typeof obj[key] === "string" && /^\$\$.*\$\$$/.test(obj[key])) {
//             stringWithoutDollars = removeDoubleDollars(obj[key]);
//             console.log(`${key}: ${obj[key]} and string without $$$$ : ${stringWithoutDollars}  and real data value is : ${realdata[stringWithoutDollars]} `);
//             obj[key] = realdata[stringWithoutDollars];

//         } else if (typeof obj[key] === "object") {
//             replacePlaceholders(obj[key], realdata)
//         }
//     }

// }

// replacePlaceholders(conditions, realdata)
// console.log(conditions);

// // ___________________________________________________

// // now i have to create another function data will convert "user.id" string to user["id"] && "uni.data.data"
// // to ini['data']['data']
// // and get the data from realdata
// // only if  the string has dot oe more "user.id"  by explode and remove the.
// //     realdata[uni][data][data][data]

// // use chat GPT TO MAKE THIS FUNCTION
// realdata = {

//     "user": {
//         "fullName": "dd ddd",
//         "id": 26,
//         "firstName": "dd",
//         "lastName": "ddd",
//         "email": "lll@lll.com",
//         "password": "$2b$10$HlgfX4.1mzqEK1viHOla/O1ZuRWpQ1K9lRw/jFFn5wZrBE9m7B85S",
//         "RoleId": 4
//     },

//     "university": {
//         "name": "husteler uni",
//         "students": "1000",
//     },

//     "title": "joy boy is back",

// }

// // ___________________________________________________

// conditions = {
//     age: "$$user.age$$",
//     createdAt: { $lte: "$$today$$" },
//     status: { $in: ["review", "$$published$$"] },
//     price: { $gte: 10, $lte: "$$lteNumber$$" },
// };

// realdata = {
//     today: "2023-08-03",
//     published: "approved",
//     lteNumber: 20,
//     "user.age": 999,
// };

// function replacePlaceholders(obj, data) {
//     for (key in obj) {
//         if (typeof obj[key] === ) {
//             stringWithoutDollars = removeDoubleDollars(obj[key]);
//             if (stringWithoutDollars in data) {
//                 obj[key] = data[stringWithoutDollars];
//             }
//         } else if (typeof obj[key] === "object") {
//             replacePlaceholders(obj[key], data);
//         }
//     }
// }

// function removeDoubleDollars(inputString) {
//     return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
// }

// replacePlaceholders(conditions, realdata);

// console.log("Updated conditions:", conditions);

// // ___________________________________________________________________________

// // targetElement =document.querySelector('[role="feed"]');
// targetElement = document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf.ecceSd');

// targetElement.children[0].scrollTo({
//     top: targetElement.children[0].scrollHeight,
//     behavior: 'smooth'
// });

// conditions = { "userId": '$$user.id$$', "age": 100, "role": "admin", "title": "$$title$$" }
// realdata = { "user.id": 15, "age": 100, "job": "webdeveloper", "title": "joy boy is back lol xd" }
// Editedconditions = { ...conditions };

// for (key in Editedconditions) {
//     stringChecker = /^\$\$.*\$\$$/.test(Editedconditions[key]);

//     function removeDoubleDollars(inputString) {
//         return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
//     }

//     if (stringChecker) {
//         stringWithoutDollars = removeDoubleDollars(Editedconditions[key]);
//         console.log(`${key}: ${Editedconditions[key]} and string without $$$$ : ${stringWithoutDollars}  and real data value is : ${realdata[stringWithoutDollars]} `);
//         Editedconditions[key] = realdata[stringWithoutDollars];

//         console.log(conditions);
//         console.log(Editedconditions);
//     }
// }

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// conditions = { userId: "$$user.id$$", age: 100, role: "admin", title: "$$title$$" };
// realdata = { "user.id": 15, age: 100, job: "webdeveloper", title: "joy boy is back lol xd" };
// Editedconditions = { ...conditions };

// for (key in Editedconditions) {
//   stringChecker = /^\$\$.*\$\$$/.test(Editedconditions[key]);

//   function removeDoubleDollars(inputString) {
//     return inputString.replace(/^\$\$(.*)\$\$$/, "$1");
//   }

//   if (stringChecker) {
//     stringWithoutDollars = removeDoubleDollars(Editedconditions[key]);
//     console.log(`${key}: ${Editedconditions[key]} and string without $$$$ : ${stringWithoutDollars}  and real data value is : ${realdata[stringWithoutDollars]} `);
//     Editedconditions[key] = realdata[stringWithoutDollars];

//     console.log(conditions);
//     console.log(Editedconditions);
//   }
// }
