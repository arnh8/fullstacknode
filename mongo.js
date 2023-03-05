const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.hww2z5k.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model("Person", personSchema);

if (process.argv.length == 3) {
    console.log("Printing Persons:");
    Person.find({}).then((res) => {
        res.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}

if (process.argv.length == 5) {
    console.log("Adding Person:");
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({ name: name, number: number });
    person.save().then((res) => {
        console.log("Person saved");
        console.log(res);
        mongoose.connection.close();
    });
}
