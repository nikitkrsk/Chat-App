# GIT MOST USED COMMANDS
```bash
git add .
git commit -m'Message'
git push 
git checkout branch
git checkout -b NewBranch
git merge someBranch 
```
# Useful JS
```js
const a = "Hello" + Value
const b = `hello ${Value}`

// if 
// else
// ternary operator
const A = "apples"

if (A = "apples"){
  console.log("yes")
}else{
  console.log("no")
}
A = "apples" ? console.log("yes") : console.log("no")
// map, filter, reduce - foreach generate a lot oof side effects
/// map generates new array
// filter filters array (el, index)\
// reduce 
const reverseString = (s) => {
  return s.split("").reduce((rev, char) => char+rev, "");
}
console.log(reverseString('hello'));



// Promise 
const promise = new Promise((resolve, reject) => {
  if (true) {
    resolve("all Ok");
  } else {
    reject("Not workig");
  }
});
const promiseOne = new Promise((reslove, reject) => {
  setTimeout(reslove, 1000, "1000");
});
const promiseTwo = new Promise((reslove, reject) => {
  setTimeout(reslove, 2000, "2000");
});
const promiseThree = new Promise((reslove, reject) => {
    setTimeout(reject, 2000, "2000");
  });

Promise.all([promise, promiseOne, promiseTwo]).then((values) =>
  console.log(values)
);
Promise.allSettled([promise, promiseOne, promiseThree]).then((values) =>
  console.log(values)
).catch(e => console.log("error"))

promise
  .then((result) => result + "1")
  .then((resultPlusOne) => {
    return console.log(resultPlusOne);
  })
  .catch((err) => console.log(err));

const urls = [
  "https://jsonplaceholder.typicode.com/posts",
  "https://jsonplaceholder.typicode.com/comments",
  "https://jsonplaceholder.typicode.com/users",
];

Promise.all(
  urls.map((url) => {
    return fetch(url).then((resp) => resp.json());
  })
)
  .then((results) => results.reduce((a, b) => a.concat(b), []))
  .catch((err) => console.log(err.message))
  .then((final) => console.log(final))
  .finally(() => console.log("NO PARAMETR , HAPPENS ON NO MATTER ON RESULT"))

const getData = async function () {
  try {
    const data = await Promise.all(
      urls.map((url) => {
        return fetch(url).then((resp) => resp.json());
      })
    );
    console.log(data[0]);
  } catch (err) {
    console.log(err.message);
  }
};

const getData2 = async function() {
    const arrayOfPromises = urls.map(url => fetch(url))
    for await (let request of arrayOfPromises) {
        const data = await request.json()
        console.log(data)
    }
}
```



# Project

 INSTALL TSC - TYPESCRIPT GLOBALLY 
 npm init
 npm install -D typescript
 npm install -D tslint
 npx tsc --init // tsc --init
 ./node_modules/.bin/tslint --init
 modify tsconfig.json
 create .prettierrc
 npm install @types/cors @types/express @types/password-hash cors dotenv express joi jsonwebtoken jwt-decode password-hash pg ts-node typeorm
 
 if you want to install particulare version of some npm module add @version (@2.2.1)

 everything @types/. - types annotation for typescript
 cors - CORS middleware
 dotenv -- Allow .env files 
 express - web framework
 joi - validation 
 jsonwebtoken - JWT token for authorization/authentication
 jwt-decode - for checking the token
 password-hash - hashing the passwords of users cause it's not allowed to store those in normal format
 pg - postgres
 ts-node - typescript for node
 typeorm - ORM for typescript Sequelize is one of the famous - in big comapnies are not used in most of the cases - they write pure SQL queries - for startups or small projects are ok in most of the cases . https://blog.logrocket.com/why-you-should-avoid-orms-with-examples-in-node-js-e0baab73fa5/ Good article

 add .env 
 add src folder
 add index.ts file
 add ormconfig.ts file if typorm is used

 change package.json scripts

...



# To Create Migration in TYPORM 
```
npm run typeorm:cli -- migration:create -n MigrationName
npm run typeorm:cli -- migration:create -n Admins

```
# POSTGRES INSTALLATION 
sudo apt install postgresql postgresql-contrib

sudo -u postgres createuser <username>
sudo -u postgres createuser newuser

sudo -u postgres createdb <dbname>
sudo -u postgres createdb somedatabase

sudo -u postgres psql
alter user <username> with encrypted password '<password>';
alter user newuser with encrypted password 'secret123';
ALTER ROLE <username> SUPERUSER;
ALTER ROLE newuser SUPERUSER;


ALTER USER user_name WITH PASSWORD 'new_password';
ALTER USER newuser WITH PASSWORD 'secret123';