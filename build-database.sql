DROP schema IF EXISTS ghost_racer;

create schema ghost_racer;

CREATE TABLE ghost_racer.USERS(USERNAME VARCHAR(20) PRIMARY KEY,
				PASSWORD VARCHAR(256) NOT NULL,
				EMAIL VARCHAR(50));

CREATE TABLE ghost_racer.workouts(WORKOUT_ID INTEGER AUTO_INCREMENT PRIMARY KEY,
				FOREIGN KEY (USERNAME) REFERENCES ghost_racer.USERS(USERNAME),
				DISTANCE FLOAT,
			       	PR BOOLEAN, 
				TIME FLOAT, 
				AVG_PACE FLOAT,
			       	SPEED FLOAT);	
