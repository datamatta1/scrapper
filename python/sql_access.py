from multiprocessing import connection
from sqlite3 import connect
from venv import create
import mysql.connector
from mysql.connector import Error
import pandas as pd
from user_info import password

def create_server_connection(host_name, user_name, user_password, db_name):
    connection = None

    try:
        connection = mysql.connector.connect(
            host = host_name,
            user = user_name,
            password = user_password,
            database = db_name
        )
        print("MySQL Database connection successful!")
    except Error as err:
        print(f"Error: {err}")

    return connection


def create_database(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        print("Database created successfully!")
    except Error as err:
        print(f"Error: {err}")


def execute_query(connection, query):
    """
    Takes argument query and executes it in SQL. Prints if sucessful.
    query -> str
    """
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query sucessful")

    except Error as err:
        print(f"Error: {err}")

def read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try: 
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as err:
        print(f"Error: {err}")

#? Creating tables and relations
#! Mulit-line formatting used for ease of reading
create_users_table = """
CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(40),
    PRIMARY KEY(user_id)
);

"""

create_items_table = """
CREATE TABLE items (
    user INT,
    item_id INT,
    item_name VARCHAR(100),
    item_price DECIMAL(5,2),
    image VARCHAR(100)
);

"""

alter_items_table = """
ALTER TABLE items
ADD FOREIGN KEY(user)
REFERENCES users(user_id)
ON DELETE SET NULL;
"""

#? Populating the Tables

pop_users = """
INSERT INTO users VALUES
(1, "Domagoj", "Lovric", "lovric.domagoj1@gmail.com"),
(2, "Dominic", "Lovric", "lovric.dominic@gmail.com"),
(3, "Mateo", "Komljenovic", "mkomljenovic11@gmail.com");
"""

pop_items = """
INSERT INTO items VALUES
(1, 2345, "Pool", "49.99", "https://m.media-amazon.com/images/I/61wQEEEHpcL._AC_SL1500_.jpg"),
(1, 2346, "Charger", "19.99", "https://m.media-amazon.com/images/I/61wQEEEHpcL._AC_SL1500_.jpg"),
(1, 2347, "Gardening Kit", "78.99", "https://m.media-amazon.com/images/I/71frVy7pkcL._AC_SL1500_.jpg");
"""

#? Reading the values

q1 = """
SELECT *
FROM users;
"""


db = "PriceChecker"
connection = create_server_connection("localhost", "root", password, db)
# create_database_query = "CREATE DATABASE {}".format(db)
# create_database(connection, create_database_query)
# execute_query(connection, create_users_table)
# execute_query(connection, create_items_table)
# execute_query(connection, alter_items_table)
# execute_query(connection, pop_users)
# execute_query(connection, pop_items)

results = read_query(connection, q1)


#? Printing the result
# for result in results:
#     print(result)


#? Formatting the output into a pandas DataFrame

from_db = []

for result in results:
    result = list(result)
    from_db.append(result)

columns_users = ["user_id","first_name","last_name","email"]

df = pd.DataFrame(from_db, columns = columns_users)

print(df)