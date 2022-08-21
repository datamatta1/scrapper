from distutils.cmd import Command
from sql import Sql

class Crud(Sql):

    def __init__(self):
        self.items = """SELECT * FROM items;"""
        self.users = """SELECT * FROM users;"""

    def read_users(self):
        return self.users
    
    def read_items(self):
        return self.items

    def update_price(self, id, price):
        command = f"UPDATE items\nSET item_price = {price}\nWHERE item_id = {id}"
        return command
    
    def update_name(self, id, name):
        command = f"UPDATE items\nSET item_name = {name}\nWHERE item_id = {id}"
        return command
    
    def update_image(self, id, image):
        command = f"UPDATE items\nSET image = {image}\nWHERE item_id = {id}"
        return command

    def update_many_items(self):
        command = '''
        INSERT INTO items (item_id, item_name, item_price, image) 
        VALUES (%s, %s, %s, %s)
        '''
        return command