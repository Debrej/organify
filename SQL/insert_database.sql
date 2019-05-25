/*region ORGAS*/

INSERT INTO ORGA (last_name, first_name, mail) VALUES ('Bellanger','Thibaut', 't.bellanger34@gmail.com');

/*endregion*/

/*region PWD*/

INSERT INTO PWD (idOrga, pwd) VALUES (1, '$2a$10$yu40Y4WxBNNuGq2h2mCLYukk2JcjrB7SDKANPFGfmGaRDsXGYyClq');

/*endregion*/

/*region SHIFT*/

INSERT INTO SHIFT (start_date, end_date) VALUES ('2019-03-07 14:00:00', '2019-03-07 15:00:00'),
                                                ('2019-03-07 15:00:00', '2019-03-07 16:00:00'),
                                                ('2019-03-07 16:00:00', '2019-03-07 17:00:00');

/*endregion*/

/*region SUBSHIFT*/

INSERT INTO SUBSHIFT (start_date, end_date, idShift) VALUES ('2019-03-07 14:00:00', '2019-03-07 14:15:00', 1),
                                                            ('2019-03-07 14:15:00', '2019-03-07 14:30:00', 1),
                                                            ('2019-03-07 14:30:00', '2019-03-07 14:45:00', 1),
                                                            ('2019-03-07 14:45:00', '2019-03-07 15:00:00', 1),
                                                            ('2019-03-07 15:00:00', '2019-03-07 15:15:00', 2),
                                                            ('2019-03-07 15:15:00', '2019-03-07 15:30:00', 2),
                                                            ('2019-03-07 15:30:00', '2019-03-07 15:45:00', 2),
                                                            ('2019-03-07 15:45:00', '2019-03-07 16:00:00', 2),
                                                            ('2019-03-07 16:00:00', '2019-03-07 16:15:00', 3),
                                                            ('2019-03-07 16:15:00', '2019-03-07 16:30:00', 3),
                                                            ('2019-03-07 16:30:00', '2019-03-07 16:45:00', 3),
                                                            ('2019-03-07 16:45:00', '2019-03-07 17:00:00', 3);

/*endregion*/

/*region TASK*/

INSERT INTO TASK (name, description, idOrga) VALUES ('Manger pizza', 'Consiste a prendre la pizza, la mettre dans la bouche, macher et avaler', 1),
                                            ('Boire du pepsi','Ouvrir la canette, attendre le départ des bulles et boire le précieux liquide', 1);
INSERT INTO TASK (name, description, idOrga) VALUES ('Mission flux', 'La meilleure mission du monde', 1);

/*endregion*/

/*region SHIFT TASK*/

INSERT INTO SHIFT_TASK (idSubShift, idTask) VALUES (1,1), (2,1), (3,1), (4,1),
                                                   (6,2), (7,2), (8,2);
INSERT INTO SHIFT_TASK (idSubShift, idTask) VALUES (10,3), (11,3), (12,3);

/*endregion*/

/*region SHIFT ORGA*/

INSERT INTO SHIFT_ORGA (idShift, idOrga) VALUES (1,1), (2,1),
                                                (2,2), (3,2);

/*endregion*/