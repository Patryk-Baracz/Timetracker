const apikey = 'dbb65296-61d5-4b0c-b633-496544d97a9e';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {headers: {Authorization: apikey}}
    ).then(
        function (resp) {
            return resp.json();
        }
    );
}

function timeFormat(minutes) {
    if (minutes >= 60) {
        let hours = Math.floor(minutes / 60);
        let rest = minutes % 60;
        return `${hours}h ${rest}m`
    } else {
        return `${minutes}m`
    }
}

function renderOperation(ulList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    ulList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = timeFormat(timeSpent);
    descriptionDiv.appendChild(time)

    if (status === 'open') {
        const btnDiv = document.createElement('div');
        li.appendChild(btnDiv);

        const btn15m = document.createElement('button');
        btn15m.className = 'btn btn-outline-success btn-sm mr-2';
        btn15m.innerText = '+15m';
        btnDiv.appendChild(btn15m);
        btn15m.addEventListener('click', () =>{
            apiUpdateOperation(operationId, operationDescription, timeSpent+15).then((resp) => {
                time.innerText = timeFormat(resp.data.timeSpent);
                timeSpent = resp.data.timeSpent;
            });
        });
        const btn1h = document.createElement('button');
        btn1h.className = 'btn btn-outline-success btn-sm mr-2';
        btn1h.innerText = '+1h';
        btnDiv.appendChild(btn1h);
        btn1h.addEventListener('click', () =>{
            apiUpdateOperation(operationId, operationDescription, timeSpent+60).then((resp) => {
                time.innerText = timeFormat(resp.data.timeSpent);
                timeSpent = resp.data.timeSpent;
            });
        });

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-outline-danger btn-sm';
        btnDelete.innerText = 'Delete';
        btnDiv.appendChild(btnDelete)

        btnDelete.addEventListener('click', ()=>{
            apiDeleteOperation(operationId).then(() =>{
                li.remove()
            })
        })

    }
}

function renderTask(taskId, title, description, status) {
    console.log('Zadanie o id=', taskId);
    console.log('tytuł to:', title);
    console.log('opis to:', description);
    console.log('status to:', status);

    const section = document.createElement("section");
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
        finishButton.addEventListener('click', () => {
            status = 'finished'
            apiUpdateTask(taskId, title, description, status).then(()=>{
                section.querySelectorAll('.js-task-open-only').forEach((el) =>{
                    el.parentElement.removeChild(el);
                });
            });
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => {
        apiDeleteTask(taskId).then(() => {
            section.remove();
        })
    })

    const ulList = document.createElement('ul');
    ulList.className = 'list-group list-group-flush';
    section.appendChild(ulList);

    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ulList, status, operation.id, operation.description, operation.timeSpent);
                }
            );
        }
    )

    if(status == 'open') {
        const formDiv = document.createElement('div');
        formDiv.className = 'card-body js-task-open-only';
        section.appendChild(formDiv);

        const form = document.createElement('form');
        formDiv.appendChild(form);

        const inFormDiv = document.createElement('div');
        inFormDiv.className = 'input-group';
        form.appendChild(inFormDiv);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Operation description';
        input.className = 'form-control';
        input.minLength = 5;
        inFormDiv.appendChild(input);

        const formButtonDiv = document.createElement('div');
        formButtonDiv.className = 'input-group-append';
        inFormDiv.appendChild(formButtonDiv);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        formButtonDiv.appendChild(addButton);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            apiCreateOperationForTask(taskId, input.value).then((resp) => {
                renderOperation(ulList, status, resp.data.id, resp.data.description, resp.data.timeSpent);
            });
        })
    }

}


function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then((resp) => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
        }
    )
}

document.addEventListener('DOMContentLoaded', function () {
    apiListTasks().then(
        function (response) {
            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        }
    );
    let formForm = document.querySelector('.js-task-adding-form');
    formForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let title = document.querySelector('#title').value;
        let description = document.querySelector('#description').value;
        apiCreateTask(title, description).then(
            function (response) {
                renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
            }
        )
    });
});

function apiUpdateOperation(operationId, description, timeSpent) {
     return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: timeSpent}),
            method: 'PUT'
        }
    ).then((resp) => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
        }
    )
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}`,
        {
            headers: {Authorization: apikey},
            method: 'Delete'
        }
    ).then((resp) => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
    })
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            headers: {Authorization: apikey},
            method: 'Delete'
        }
    ).then((resp) =>{
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
    })
}

function apiUpdateTask(taskId, title, description, status) {
    fetch(
        apihost + `/api/tasks/${taskId}`,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: status}),
            method: 'PUT'
        }
    ).then((resp) => {
        if (!resp.ok) {
            alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
        }
        return resp.json();
    })
}