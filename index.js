require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person");

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let persons = ["wawwaaa"];

app.get("/api/persons", (request, response) => {
    Person.find({}).then((person) => {
        response.json(person);
    });
});

app.get("/api/persons/:id", (request, response) => {
    /*
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
*/
    Person.findById(request.params.id).then((person) => {
        response.json(person);
    });
});

app.get("/info", (request, response) => {
    const date = new Date(Date.now());
    let test = date.toString();

    response.send(
        `<p>Persons has info for ${persons.length} people.</p><p>${test}</p>`
    );
});

app.delete("/api/persons/:id", (request, response) => {
    /*
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
*/
    Person.findByIdAndRemove(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((err) => {
            next(err);
        });
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    /*
    if (!body.name) {
        return response.status(400).json({
            error: "name missing",
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: "number missing",
        });
    }

    if (nameInPhonebook(body.name, persons)) {
        return response.status(400).json({
            error: "duplicate name",
        });
    }
*/

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((err) => next(err));
});

const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    if (err.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if ((err.name = "ValidationError")) {
        return res.status(400).send({ error: err.message });
    }

    next(err);
};

app.use(errorHandler);

function nameInPhonebook(name, phonebook) {
    //console.log("name is " + name);

    if (
        phonebook.find((person) => {
            //console.log("comparing with " + person.name);
            if (person.name === name) {
                return true;
            }
        })
    ) {
        console.log("returning true");
        return true;
    } else {
        return false;
    }
}
