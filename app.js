/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {

  var searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  switch (searchType) {
    case 'yes':
      searchByName(people);
      break;
    case 'no':
      searchByTrait(people);
      break;
    default:
      alert("Invalid input. Please try again!");
      app(people); // restart app
      break;
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  var displayOption = prompt("Found " + person.firstName + " " + person.lastName + ". Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch (displayOption) {
    case "info":
      displayPerson(person);
      break;
    case "family":
      getFamily(people, person);
      break;
    case "descendants":
      displayPeople(seeDescendants(people, person));
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function searchByName(people) {
  var firstName = promptFor("What is the person's first name?", chars).toLowerCase();
  var lastName = promptFor("What is the person's last name?", chars).toLowerCase();

  let filteredPeople = people.filter(function (el) {
    if (el.firstName.toLowerCase() === firstName && el.lastName.toLowerCase() === lastName) {
      return el;
    }
  });

  mainMenu(filteredPeople[0], people);
}

function searchByTrait(people, peopleWithTraits = []) {
  var trait = promptFor("What trait would you like to search for?", traits);
  var traitValue = promptFor("What is the value of the desired trait? (ex: if you entered weight for trait, this value could be 120)", chars);
  if (peopleWithTraits.length == 0) {
    var filteredPeopleByTrait = people.filter(function (el) {
      if (el[trait] == traitValue) {
        return el;
      }
    });
  }
  else {
    var filteredPeopleByTrait = peopleWithTraits.filter(function (el) {
      if (el[trait] == traitValue) {
        return el;
      }
    });
  }
  var multiple = promptFor("Would you like to search for more traits?", yesNo).toLowerCase();
  switch (multiple) {
    case "no":
      displayPeople(filteredPeopleByTrait);
      searchByName(people);
      break;
    case "yes":
      searchByTrait(people, filteredPeopleByTrait);
      break;
  }
}

// function seeDescendants(people, person){
//   let descendants = [];
//   let children = people.filter(function(el){
//     if(el.parents[0] == person.id || el.parents[1] == person.id){
//       return true;
//     }
//   });
//   descendants = descendants.concat(children);
//   for(let i = 0; i< children.length; i++){
//     descendants = descendants.concat(seeDescendants(people, children[i]));
//   }
//   return descendants;
// }

function seeDescendants(people, person, allChildren = []) {
  var allDescendants = allChildren;
  var descendants = people.filter(function (el) {
    if (el.parents[0] == person.id || el.parents[1] == person.id) {
      allDescendants.push(el);
      return true;
    }
  });
  for (let i = 0; i < descendants.length; i++) {
    seeDescendants(people, descendants[i], allDescendants);
  }
  return allDescendants;
}

function getFamily(people, person) {

  var printFamily = "";
  var family = seeDescendants(people,person);
  if(family.length > 0){
    printFamily += "All Children and Grandchildren: \n";
    for(let i = 0; i < family.length; i++){
      printFamily += family[i].firstName + " " + family[i].lastName + "\n";
    }
  }

  family = getParents(people, person);
  if (typeof family != 'undefined') {
    printFamily += "Parents and Grandparents: \n";
    family = family.filter(function (el) {
      return el !== undefined;
    });
    for (let i = 0; i < family.length; i++) {
      printFamily += family[i].firstName + " " + family[i].lastName + "\n";
    }
  }

  family = getSiblings(people, person)
  if (typeof family != 'undefined') {
    printFamily += "Siblings: \n";
    for (let i = 0; i < family.length; i++) {
      printFamily += family[i].firstName + " " + family[i].lastName + "\n";
    }
  }

  family = getSpouse(people, person);
  if (typeof family != 'undefined') {
    printFamily += "Spouse: \n";
    printFamily += family[0].firstName + " " + family[0].lastName + "\n";
  }
  alert(printFamily);
}

function getParents(people, person) {
  var parentsAndGrandparents = [];
  if (person.parents.length > 0) {
    var parents = people.filter(function (el) {
      if (el.id == person.parents[0] || el.id == person.parents[1]) {
        parentsAndGrandparents.push(el);
        return el;
      }
    });

    for (let i = 0; i < parents.length; i++) {
      parentsAndGrandparents = parentsAndGrandparents.concat(getParents(people, parents[i]));
    }
    return parentsAndGrandparents;
  }
}

function getSiblings(people, person){
  if(person.parents.length > 0){
    var siblings = people.filter(function(el){
      if((el.parents[0] == person.parents[0] || el.parents[1] == person.parents[1]) && el.id != person.id){
        return el;
      }
    });
    return siblings;
  }
}

function getSpouse(people, person) {
  if (person.currentSpouse != null) {
    var spouse = people.filter(function (el) {
      if (el.id == person.currentSpouse) {
        return el;
      }
    });
    return spouse;
  }
}

// alerts a list of people
function displayPeople(people) {
  alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  var personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Date of Birth: " + person.dob + "\n";
  personInfo += "Height: " + person.height + " inches\n";
  personInfo += "Weight: " + person.weight + " pounds\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, callback) {
  do {
    var response = prompt(question).trim();
  } while (!response || !callback(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input) {
  return true; // default validation only
}

function traits(input) {
  return input == "firstName" || input == "lastName" || input == "gender" || input == "dob" || input == "height" || input == "weight" || input == "eyeColor" || input == "occupation"
}