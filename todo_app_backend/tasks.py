from db import get_connection
from tabulate import tabulate

def create_task(title, description, due_date):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO tasks (title, description, due_date) VALUES (%s, %s, %s)",
        (title, description, due_date)
    )
    conn.commit()
    cur.close()
    conn.close()
    print("Tarea creada con exito.")

def list_tasks(show_completed=None):
    conn = get_connection()
    cur = conn.cursor()

    query = "SELECT id, title, description, due_date, completed FROM tasks"
    if show_completed is not None:
        query += " WHERE completed = %s"
        cur.execute(query, (show_completed,))
    else:
        cur.execute(query)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    print(tabulate(rows, headers=["ID", "Título", "Descripción", "Fecha límite", "Completada"], tablefmt="grid"))

def complete_task(task_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE tasks SET completed = TRUE WHERE id = %s", (task_id,))
    conn.commit()
    cur.close()
    conn.close()
    print(f"Tarea {task_id} marcada como completada")

def update_task(task_id, title=None, description=None, due_date=None):
    conn = get_connection()
    cur = conn.cursor()
    if title:
        cur.execute("UPDATE tasks SET title = %s WHERE id = %s", (title, task_id,))
    if description:
        cur.execute("UPDATE tasks SET description = %s WHERE id = %s", (description, task_id,))
    if due_date:
        cur.execute("UPDATE tasks SET due_date = %s WHERE id = %s", (due_date, task_id,))
    conn.commit()
    cur.close()
    conn.close()
    print(f"Tarea {task_id} actualizar.")

def delete_task(task_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    conn.commit()
    cur.close()
    conn.close()
    print(f"Tarea {task_id} eliminada.")