import psycopg2

def get_connection():
    return psycopg2.connect(
        dbname="todo_db",
        user="postgres",
        password="Ed02041998",
        host="localhost",
        port="5432"
    )