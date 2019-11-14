const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    db('posts').select('*')
    .then( posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({message: 'problems with database'});
    })
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('posts').where({id})
        .then(post => {
            if (post[0]) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'invalid id'})
            }
        })
        .catch(err => {
            res.status(500).json({message: 'db problem'})
        })
});

router.post('/', (req, res) => {
    const postData = req.body;

    db('posts').insert(postData)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({message: 'db problem'})
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('posts').where({ id }).update(changes)
        .then(count => {
            if (count) {
                res.status(200).json({ updated: count });
            } else {
                res.status(404).json({ message: 'invalid id' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'db problem' });
        });

});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    try {
        const count = await db.del().from('posts').where({ id });
        count ? res.status(200).json({ deleted: count })
            : res.status(404).json({ message: 'invalid id' });
    } catch (err) {
        res.status(500).json({ message: 'database error', error: err });
    }
});

module.exports = router;