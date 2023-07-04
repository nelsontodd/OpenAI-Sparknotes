from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.flask_db

assignments = db.assignments
users = db.users
users.create_index('email', unique=True)


def get_all_assignments_for_user(user):
    user_id = user['_id']
    assignments_list = list(
        assignments.find({'user_id': user_id}, {'_id': 0 , 'user_id': 0})
    )
    return assignments_list

def get_assignment_for_user(user, filename):
    user_id = user['_id']
    assignment = assignments.find_one(
        {'user_id': user_id, 'name': filename}
    )
    return assignment

def insert_assignment(user, file):
    filename = file.filename
    user_id = user['_id']
    assignment = assignments.find_one(
        {'user_id': user_id, 'name': filename}
    )
    if assignment:
        return False
    else:
        assignments.insert_one(
            {'name': file.filename, 'user_id': user_id}
        )
        return True
