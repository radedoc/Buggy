import os
import logging

from random import randint

from flask import Flask, render_template

from flask_ask import Ask, statement, question, session


app = Flask(__name__)

ask = Ask(app, "/")

logging.getLogger("flask_ask").setLevel(logging.DEBUG)

alltyped = []

@ask.launch

def new_game():

    welcome_msg = render_template('welcome')

    return question(welcome_msg)


@ask.intent("TypePythonIntent")

def typeSomething(Keyword, Variable, Comparison, Number):

    alltyped.append([Keyword, Variable, 'is', Comparison, Number])

    return question("")


@ask.intent("AnswerIntent", convert={'first': int, 'second': int, 'third': int})

def answer(first, second, third):

    winning_numbers = session.attributes['numbers']

    if [first, second, third] == winning_numbers:

        msg = render_template('win')

    else:

        msg = render_template('lose')

    return statement(msg)


#if __name__ == '__main__':

 #   app.run(debug=True)

if __name__ == "__main__":
     port = int(os.environ.get("PORT", 5000))
     app.run(host='0.0.0.0', port=port)
