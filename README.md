# COMP9900 Project P8 Event Mangement System
The web-based platform for manaing events.This straightforward event booking system was completed over three development sprints. Our primary objective
was to establish a dual platform—one that enables consumers to purchase
tickets for diverse events and another that allows potential organizers to post
details about upcoming performances. Through persistent effort, we successfully developed the software. For users, the system supports functionalities
such as event browsing, ticket booking, seat selection, ticket refunds, and
personalized event recommendations. For organizers, it offers tools to create
events and modify details such as the location, time, pricing, and a descriptive overview of the performance. We have implemented advanced encryption
techniques to safeguard customer information and protect their rights and
interests. Moreover, we designed a specialized performance recommendation
algorithm to suggest events tailored to the users’ interests.

## Contributor
Zhuoyang Li
z5391485@unsw.edu.au
Liyongshi Chen
z5375235@unsw.edu.au
Shulin Li
z5345395@unsw.edu.au
Huihua Huang
z5405386@unsw.edu.au
Zixiang Zhou
z5473539@unsw.edu.au

## How to implement
The backend in this project applied python and django as the main structure
of the project, to build the total system’s backend . Apart from django, we
also applied to some other public libraries like Numpy and Sklearn. The
python environment is 3.8. After installing the correct version of python,
put the files under a certain root. After that, run the following commend.
###  `pip install -r requirements.txt `
Before activating the front end part, make sure the backend part is activated
and working. To activate the backend, run the command in the python
terminal:
### `python manage.py runserver`

Step 1: Open the project folder, in the V isual Studio Code or P yCharm. And
also open a terminal for the frontend. When the terminal is activated,
type in the following command to enter in the sub-file of the frontend
part.
### `cd frontend`

Step 2: Enter the npm install to install the needed packages

### `npm install`

Step 3: Enter the following command, to make sure the frontend is working
successfully.

### `set NODE_OPTIONS=--openssl-legacy-provider`

Step 4: Enter npm start to start the frontend part.

### `npm start`

