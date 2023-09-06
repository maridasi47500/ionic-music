CREATE TABLE IF NOT EXISTS songtable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT, 
    title TEXT,
composer text,
isPublished integer,
description text,
image text,
filename text,
title text
);
INSERT or IGNORE INTO songtable(id, artist, title) VALUES (1, 'Justin Bieber', 'Yummy');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (2, 'Jonas Brothers', 'What A Man Gotta Do');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (3, 'Life Is Good', 'Future');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (4, 'Lauv', 'Tattoos Together');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (5, 'Heavy Steppers', 'Whateva');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (6, 'DigDat 2020', 'Ei8ht Mile');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (7, 'Blackbear', 'me & ur ghost');
INSERT or IGNORE INTO songtable(id, artist,title) VALUES (8, 'Hailee Steinfeld', 'Wrong Direction');
