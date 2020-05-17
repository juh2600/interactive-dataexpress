# Schemas

Account:
	- `username`: String, unique
	- `password`: String, salt/hash
	- `email`: String
	- `dob`: Date
	- `questions`: Array of objects
		- `id`: ObjectID, key into table of Questions
		- `answer`: Number

Question:
	- `question`: String
  - `options`: Array[String]
