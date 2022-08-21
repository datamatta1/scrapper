from user_info import password
import mysql.connector
from mysql.connector import Error
import pandas as pd


class Sql():

    def __init__(self):
        self.host_name = "localhost"
        self.user_name = "root"
        self.password = password
        self.db_name = "PriceChecker"
    

    def server_connection(self):
        connection = None
        try:
            connection = mysql.connector.connect(
                host = self.host_name,
                user = self.user_name,
                password = self.password,
                database = self.db_name
            )
            print(f"Connection to the database: {self.db_name} was successful!")
        
        except Error as err:
            print(f"Error: {err}")
        
        return connection
    

    def create_database(self, connection, query):
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            print("Database created successfully!")
        except Error as err:
            print(f"Error: {err}")


    def read_query(self, connection, query):
        cursor = connection.cursor()
        result = None
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as err:
            print(f"Error: {err}")


    def execute_query(self, connection, query):
        cursor = connection.cursor()
        try:
            cursor.execute(query)
            connection.commit()
            print("Query successful!")
        except Error as err:
            print(f"Error: {err}")


    def pandas_format(self, results, output):
        from_db = []
        columns_users = ["user_id","first_name","last_name","email"]
        columns_items = ["user_id","item_id","item_name","item_price","image"]

        if output == "users":
            
            for result in results:
                result = list(result)
                from_db.append(result)
            
            return pd.DataFrame(from_db, columns = columns_users).set_index("user_id")
        
        elif output == "items":

            for result in results:
                result = list(result)
                from_db.append(result)
            
            return pd.DataFrame(from_db, columns = columns_items).set_index("user_id")
        
        else:
            print("Please select output as 'users' or 'items'.")

    
    def execute_list_query(self, connection, command, list_values):
        cursor = connection.cursor()
        try:
            cursor.executemany(command, list_values)
            connection.commit()
            print("Query Successful!")
        except Error as err:
            print(f"Error: {err}")


    def import_csv_excel(self, format, filename):
        list_values = []
        if format == "csv":
            df = pd.read_csv(filename)
            df = df.astype({"user_id":"int", "item_id":"int", "item_price":"float"})
            for row in range(df.shape[0]):
                list_values.append(tuple(df.iloc[row].values))
            return list_values

        elif format == "excel" or "xlsx" or "xls":
            df = pd.read_excel(filename)
            df = df.astype({"user_id":"int", "item_id":"int", "item_price":"float"})
            for row in range(df.shape[0]):
                list_values.append(tuple(df.iloc[row].values))
            return list_values
        else:
            print("Specify the correct format 'csv' or 'excel'")

