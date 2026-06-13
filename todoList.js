const {Client} = require('pg')
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "My password",
    database: "todo"
})
client.connect()

const ps = require("prompt-sync")
const input = ps()

function separator() {
    console.log("==========================================")
}

async function add_task() {
    let task = input("Enter the task you want to add: ")
    try {
        await client.query('INSERT INTO todolist (name) VALUES ($1)', [task])
        console.log('Task Added')
    } catch (err) {
        console.log(`Database Error: ${err.message}`)
    }
    separator()
}

async function delete_task() {
    try{
        let id_num = Number(input('Enter the id of the task you want to delete: '))
        let result = await client.query(`DELETE FROM todolist  WHERE id = $1`,[id_num])
        if (result.rowCount ===0){
            console.log("The task doesn't exist")
        }else{
            console.log('Task deleted')
        }

    }catch (err){
        console.log(`DataBase Error:${err.message}`)
    }
    separator()
}


async function modify_task() {
    try {
        let id_num = Number(input('Enter the id of the task you want to modify: '))
        let new_task = input('Enter the new task: ')
        while (new_task.length === 0) {
            new_task = input('please enter a non-empty task: ')
        }
        let result = await client.query(`UPDATE todolist SET name = $1 WHERE id = $2`, [new_task, id_num])
        if (result.rowCount === 0) {
            console.log("The task doesn't Exist")
        } else {
            console.log('Task Modified')
        }

    } catch (err) {
        console.log(`Error: ${err.message}`)
    }
    separator()
}

async function show_tasks() {
    try {
        let data = await client.query('SELECT * FROM todolist')
        let data_rows = data.rows
        if (data_rows.length === 0) {
            console.log('The List is empty')
        } else {
            for (let i = 0; i < data_rows.length; i++) {
                console.log(`[${i + 1}]==>  Task_id: ${data_rows[i].id}\nTask: ${data_rows[i].name} \nStatus : ${data_rows[i].completed}`)
                console.log('-----------------------------------')
            }
        }
    } catch (err) {
        console.log(`Database Error: ${err.message}`)
    }
    separator()
}

async function mark_as_done() {
    try {
        let id_num = Number(input('Enter the id of the task you want to mark as done: '))
        let result = await client.query(`UPDATE todolist SET completed = TRUE WHERE id = $1`, [id_num])
        if (result.rowCount === 0) {
            console.log("Task or Id doesn't exist")
        } else {
            console.log('Task marked as Done')
        }
    } catch (err) {
        console.log(`An error Occurred: ${err.message}`)
    }
    separator()
}


async function main() {
    let choice;
    let menu = "1-Add a task\n2-Delete a task\n3-Modify a task\n4-Show The tasks\n5-mark as done\n6-Exit"
    while (true) {
        console.log(menu)
        choice = Number(input("Enter the number of task you want to do: "))
        separator()
        while (choice > 6 || choice < 1) {
            choice = Number(input("Please enter a valid number: "))
            separator()
        }

        if (choice === 1) {
            await add_task()
        } else if (choice === 2) {
            await delete_task()
        } else if (choice === 3) {
            await modify_task()
        } else if (choice === 4) {
            await show_tasks()
        } else if (choice === 5) {
            await mark_as_done()
        } else {
            await client.end()
            break
        }
    }
}

main()