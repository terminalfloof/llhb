# Nothing

It'll just show `Nothing's going on.` That's it.

# Message

You can enter in a message in the data section of the json file. Please leave the message as a string with the key of `message`.
Data should look something like this:

```
"data": {
  "message": "Trial 1 has started."
}
```

# Countdown

Include a time in the data section, following this format: `Month/Day/Year Hour:Min AM/PM GMT(+/-)(some number)`.

The `GMT(+/-)(some number)` is based off of greenwich mean time, you can calculate from there.

Data should look something like this:

```
"data": {
  "time": "9/18/2020 4:40 PM GMT-5"
}
```

# Survey

Insert 3 values for data. `question`, `users`, `responseType`, and `altMessage`.

`question` must be of type `string`, <br>
`users` must be of type `array`,<br>
`responseType` must be of type `object`,<br>
and `altMessage` must be of type `string`.

NOTE: `responseType` MUST BE ALL NUMBERS. Exceptions are `"all"`, since it selects all users.

`question` is the question that appears above the input box.
`users` are the users that will receive the question.
`responseType` signifies the type of answers allowed.
`altMessage` is the message that people not included in the survey get shown.

It should look something like this:

```
  "data": {
    "question": "Who would you like to vote off?",
    "users": [17217],
    "allowedResponses": [1, 2],
    "altMessage": "There was a survey, but you're on the other team, nobo."
  }
```
