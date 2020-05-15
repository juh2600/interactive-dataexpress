# Schemas

Account:
  - `username`: String, unique
  - `password`: String, salt/hash
  - `email`: String
  - `dob`: Date
  - `questions`: Array of objects
      - `id`: Number, key into table of Questions
      - `answer`: String, hash

Question:
  - `question`: String
  - `bank`: Number, for keeping groups of questions separate


# FAQ

## Why are answers to security questions hashed?

In the event of a data breach, the answers to security questions may be exposed. It is not unlikely that these answers were reused on other sites. For this reason, we treat them with similar care to passwords.
