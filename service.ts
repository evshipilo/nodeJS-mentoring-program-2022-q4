import express from 'express';
import crypto from 'node:crypto';

const app = express();

app.listen(3000);

type User = {
    id: string;
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

const users: User[] = [
    {
        id: crypto.randomUUID(),
        login: 'string',
        password: 'string',
        age: 10,
        isDeleted: true,
}
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/user/:id', (req, res) => {
    
    res.json(req.params.id);
  });
