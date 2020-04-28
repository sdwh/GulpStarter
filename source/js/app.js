// import _ from 'lodash';
// need bundler to import

var arr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

arr = arr.map(x => (x * 2));

for (let index = 0; index < arr.length; index++) {
    const element = arr[index];   
    console.log(element);   
}