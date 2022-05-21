const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

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
  {
    id: 5,
    name: "Testing Namer",
    number: "337-12-123123",
  },
];

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const create_id = () => {
  return Math.floor(Math.random() * 100);
};

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("Body: ", req.body);
  console.log("Path: ", req.path);
  console.log("---------");
  next();
};

//app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const date_obj = new Date();
  response.send(
    `<p>Phonebook currently has ${persons.length} people</p>
    <br>
    ${date_obj}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const request_id = persons.find((person) => person.id === id);

  if (!request_id) {
    response.status(404).end();
  } else {
    response.json(request_id);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const request_id = persons.find((person) => person.id === id);
  if (request_id) {
    persons = persons.filter((person) => person.id !== id);
    response.json(persons);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const request_info = request.body;
  const dup_name = persons.filter(
    (person) => person.name === request_info.name
  );

  if (!request_info) {
    response.status(400).json({
      error: "content missing",
    });
  }

  if (dup_name.length > 0) {
    response.status(400).json({
      error: "duplicate name",
    });
  }

  const person_obj = {
    id: create_id(),
    name: request_info.name,
    number: request_info.number,
  };

  persons = persons.concat(person_obj);
  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
