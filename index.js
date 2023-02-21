const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get("/info", (request, response) => {
    const date = new Date(Date.now());
    /*
    let dateStr = `${dayOfWeekAsString(date.getDay())} ${monthAsString(
        date.getMonth()
    )}`;
*/
    let test = date.toString();

    response.send(
        `<p>Persons has info for ${persons.length} people.</p><p>${test}</p>`
    );
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log(request.body);

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

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000),
    };

    persons = persons.concat(newPerson);

    response.json(newPerson);
});

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
