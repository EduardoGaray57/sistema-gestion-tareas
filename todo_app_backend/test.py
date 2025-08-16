from tasks import create_task, list_tasks, complete_task, update_task, delete_task

# 1️⃣ Crear tareas
create_task("Estudiar Python", "Practicar CRUD con PostgreSQL", "2025-08-20")
create_task("Hacer ejercicio", "30 minutos de cardio", "2025-08-15")

# 2️⃣ Listar todas las tareas
print("\n--- Todas las tareas ---")
list_tasks()

# 3️⃣ Marcar la primera tarea como completada
complete_task(1)

# 4️⃣ Listar solo tareas pendientes
print("\n--- Tareas pendientes ---")
list_tasks(show_completed=False)

# 5️⃣ Editar la segunda tarea
update_task(2, description="45 minutos de cardio")

# 6️⃣ Listar todas las tareas de nuevo para ver cambios
print("\n--- Todas las tareas después de editar y completar ---")
list_tasks()

# 7️⃣ Eliminar la primera tarea
delete_task(1)

# 8️⃣ Listar todas las tareas para confirmar eliminación
print("\n--- Todas las tareas después de eliminar ---")
list_tasks()
