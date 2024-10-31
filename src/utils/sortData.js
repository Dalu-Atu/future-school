export function sortClasses(classes) {
  const order = { PC: 1, PRI: 2, JSS: 3, SS: 4 };

  return [...classes].sort((a, b) => {
    const [typeA, numberA] = a.name.split(' '); // Extract class type and number from class name
    const [typeB, numberB] = b.name.split(' '); // Extract class type and number from class name

    // If class types are different, sort based on the order in the 'order' object
    if (order[typeA] !== order[typeB]) {
      return order[typeA] - order[typeB];
    } else {
      // If class types are the same, sort based on the class number
      return parseInt(numberA) - parseInt(numberB);
    }
  });
}
